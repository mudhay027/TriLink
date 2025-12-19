using AutoMapper;
using Backend.Models.Domain;
using Backend.Models.DTO;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NegotiationController : ControllerBase
    {
        private readonly INegotiationRepository _negotiationRepository;
        private readonly IProductRepository _productRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly ILogisticsRepository _logisticsRepository;
        private readonly IMapper _mapper;

        public NegotiationController(
            INegotiationRepository negotiationRepository, 
            IProductRepository productRepository, 
            IOrderRepository orderRepository,
            ILogisticsRepository logisticsRepository,
            IMapper mapper)
        {
            _negotiationRepository = negotiationRepository;
            _productRepository = productRepository;
            _orderRepository = orderRepository;
            _logisticsRepository = logisticsRepository;
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> StartNegotiation([FromBody] CreateNegotiationDto createDto)
        {
            var product = await _productRepository.GetByIdAsync(createDto.ProductId);
            if (product == null) return NotFound("Product not found");

            var buyerId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);

            var negotiation = new Negotiation
            {
                Id = Guid.NewGuid(),
                ProductId = createDto.ProductId,
                BuyerId = buyerId,
                SellerId = product.SupplierId,
                Status = createDto.Status ?? "Pending",
                CurrentOfferAmount = createDto.InitialOfferAmount,
                PricePerUnit = createDto.PricePerUnit > 0 ? createDto.PricePerUnit : (createDto.Quantity > 0 ? createDto.InitialOfferAmount / createDto.Quantity : 0),
                TotalPrice = createDto.TotalPrice > 0 ? createDto.TotalPrice : createDto.InitialOfferAmount,
                Quantity = createDto.Quantity,
                Unit = createDto.Unit,
                DesiredDeliveryDate = createDto.DesiredDeliveryDate,
                Offers = new List<Offer>
                {
                    new Offer
                    {
                        Id = Guid.NewGuid(),
                        Amount = createDto.InitialOfferAmount,
                        PricePerUnit = createDto.PricePerUnit > 0 ? createDto.PricePerUnit : (createDto.Quantity > 0 ? createDto.InitialOfferAmount / createDto.Quantity : 0),
                        TotalPrice = createDto.TotalPrice > 0 ? createDto.TotalPrice : createDto.InitialOfferAmount,
                        Message = createDto.Message,
                        CreatedAt = DateTime.Now,
                        ProposerId = buyerId,
                        Quantity = createDto.Quantity
                    }
                }
            };

            await _negotiationRepository.CreateAsync(negotiation);
            return Ok(_mapper.Map<NegotiationDto>(negotiation));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            var role = User.Claims.First(c => c.Type == System.Security.Claims.ClaimTypes.Role).Value;

            var negotiations = await _negotiationRepository.GetAllAsync(userId, role);
            return Ok(_mapper.Map<List<NegotiationDto>>(negotiations));
        }

        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var negotiation = await _negotiationRepository.GetByIdAsync(id);
            if (negotiation == null) return NotFound();

            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            if (negotiation.BuyerId != userId && negotiation.SellerId != userId)
            {
                return Forbid();
            }

            return Ok(_mapper.Map<NegotiationDto>(negotiation));
        }

        [HttpPost("{id:Guid}/offers")]
        public async Task<IActionResult> AddOffer([FromRoute] Guid id, [FromBody] AddOfferDto offerDto)
        {
            var negotiation = await _negotiationRepository.GetByIdAsync(id);
            if (negotiation == null) return NotFound();

            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            if (negotiation.BuyerId != userId && negotiation.SellerId != userId)
            {
                return Forbid();
            }

            var offer = new Offer
            {
                Id = Guid.NewGuid(),
                NegotiationId = id,
                Amount = offerDto.Amount,
                PricePerUnit = offerDto.PricePerUnit > 0 ? offerDto.PricePerUnit : (offerDto.Quantity > 0 ? offerDto.Amount / offerDto.Quantity : 0),
                TotalPrice = offerDto.TotalPrice > 0 ? offerDto.TotalPrice : offerDto.Amount,
                Message = offerDto.Message,
                CreatedAt = DateTime.Now,
                ProposerId = userId,
                Quantity = offerDto.Quantity
            };

            await _negotiationRepository.AddOfferAsync(offer);
            
            negotiation.CurrentOfferAmount = offer.Amount;
            negotiation.TotalPrice = offer.TotalPrice;
            negotiation.PricePerUnit = offer.PricePerUnit;
            negotiation.Quantity = offer.Quantity;

            await _negotiationRepository.UpdateAsync(id, negotiation);

            return Ok(_mapper.Map<OfferDto>(offer));
        }

        [HttpPut("{id:Guid}/status")]
        public async Task<IActionResult> UpdateStatus([FromRoute] Guid id, [FromBody] UpdateNegotiationStatusDto statusDto)
        {
            var negotiation = await _negotiationRepository.GetByIdAsync(id);
            if (negotiation == null) return NotFound();

            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            if (negotiation.BuyerId != userId && negotiation.SellerId != userId)
            {
                return Forbid();
            }

            if (negotiation.Status == "Accepted" || negotiation.Status == "Rejected")
            {
                return BadRequest("Negotiation is already closed.");
            }

            negotiation.Status = statusDto.Status;

            // Update Offer Status
            if (negotiation.Offers != null && negotiation.Offers.Any())
            {
                Offer? offerToUpdate = null;
                if (statusDto.OfferId.HasValue)
                {
                    offerToUpdate = negotiation.Offers.FirstOrDefault(o => o.Id == statusDto.OfferId.Value);
                }
                else
                {
                    // Fallback: update the latest pending offer from the OTHER party
                    offerToUpdate = negotiation.Offers
                        .Where(o => o.ProposerId != userId && o.Status == "Pending")
                        .OrderByDescending(o => o.CreatedAt)
                        .FirstOrDefault();
                }

                if (offerToUpdate != null)
                {
                    // Only update offer status to Accepted/Rejected. 
                    // Don't update for 'InNegotiation' as it should remain 'Pending' for action.
                    if (statusDto.Status.Equals("Accepted", StringComparison.OrdinalIgnoreCase) || 
                        statusDto.Status.Equals("Rejected", StringComparison.OrdinalIgnoreCase))
                    {
                        offerToUpdate.Status = statusDto.Status;

                        // Add automated message to chat
                        var autoMessage = new Offer
                        {
                            Id = Guid.NewGuid(),
                            NegotiationId = negotiation.Id,
                            Amount = 0,
                            PricePerUnit = 0,
                            TotalPrice = 0,
                            Message = statusDto.Status.Equals("Accepted", StringComparison.OrdinalIgnoreCase) 
                                ? "I have accepted the offer. Let's proceed with the order!" 
                                : "I have rejected this offer.",
                            CreatedAt = DateTime.Now,
                            ProposerId = userId,
                            Quantity = 0,
                            Status = statusDto.Status
                        };
                        await _negotiationRepository.AddOfferAsync(autoMessage);
                    }
                    
                    // If accepted, also sync negotiation totals to this offer just in case they diverged
                    if (statusDto.Status.Equals("Accepted", StringComparison.OrdinalIgnoreCase))
                    {
                        negotiation.CurrentOfferAmount = offerToUpdate.Amount;
                        negotiation.PricePerUnit = offerToUpdate.PricePerUnit;
                        negotiation.Quantity = offerToUpdate.Quantity;
                        negotiation.TotalPrice = offerToUpdate.TotalPrice;

                        // Mark other pending offers as Rejected
                        foreach (var otherOffer in negotiation.Offers.Where(o => o.Status == "Pending" && o.Id != offerToUpdate.Id))
                        {
                            otherOffer.Status = "Rejected";
                        }
                    }
                }
            }

            await _negotiationRepository.UpdateAsync(id, negotiation);

            if (statusDto.Status.Equals("Accepted", StringComparison.OrdinalIgnoreCase))
            {
                // Create Order
                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    NegotiationId = negotiation.Id,
                    ProductId = negotiation.ProductId,
                    BuyerId = negotiation.BuyerId,
                    SellerId = negotiation.SellerId,
                    FinalPrice = negotiation.CurrentOfferAmount,
                    PricePerUnit = negotiation.PricePerUnit,
                    Quantity = negotiation.Quantity,
                    TotalPrice = negotiation.TotalPrice,
                    Status = "Confirmed",
                    CreatedAt = DateTime.Now
                };

                await _orderRepository.CreateAsync(order);

                // Create Logistics Request (Auto)
                var logistics = new LogisticsEntry
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    Status = "Open",
                    PickupLocation = negotiation.Product?.Location ?? "Supplier Warehouse",
                    DropLocation = "Buyer Address (Placeholder)", 
                    EstimatedDistanceKm = new Random().Next(10, 500), 
                    ProposedCost = 0 
                };
                
                logistics.ProposedCost = (decimal)logistics.EstimatedDistanceKm * 1.5m;

                await _logisticsRepository.CreateAsync(logistics);
            }

            return Ok(_mapper.Map<NegotiationDto>(negotiation));
        }
    }
}
