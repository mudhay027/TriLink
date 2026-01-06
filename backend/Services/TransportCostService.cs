namespace Backend.Services
{
    public interface ITransportCostService
    {
        CostBreakdown CalculateCost(
            double distanceKm,
            double durationHours,
            decimal totalWeight,
            decimal? length,
            decimal? width,
            decimal? height,
            bool isFragile,
            bool isHighValue,
            string pickupCity,
            string dropCity);
    }

    public class TransportCostService : ITransportCostService
    {
        // vehicle setup: name, max weight, fuel usage, maintenance cost, driver pay per hour
        private static readonly Dictionary<string, VehicleConfig> Vehicles = new()
        {
            ["LCV"] = new("Light Commercial Vehicle", 2000, 12, 2.0, 150),
            ["MGV"] = new("Medium Goods Vehicle", 7500, 18, 3.5, 200),
            ["HDT"] = new("Heavy Duty Truck", 16000, 25, 5.0, 250),
            ["MAT"] = new("Multi-Axle Trailer", 40000, 35, 7.0, 300),
            ["4x4"] = new("4x4 Cargo Truck", 12000, 28, 8.0, 350)
        };

        private const double DieselPricePerLiter = 95.0;
        private const double TollRatePerKm = 2.0;
        private const int DimFactor = 5000; // this is the dimensional weight divisor thing

        public CostBreakdown CalculateCost(
            double distanceKm,
            double durationHours,
            decimal totalWeight,
            decimal? length,
            decimal? width,
            decimal? height,
            bool isFragile,
            bool isHighValue,
            string pickupCity,
            string dropCity)
        {
            // step 1: figure out the chargeable weight (whichever's higher - actual or volumetric)
            decimal volumetricWeight = 0;
            if (length.HasValue && width.HasValue && height.HasValue)
            {
                volumetricWeight = (length.Value * width.Value * height.Value) / DimFactor;
            }
            decimal chargeableWeight = Math.Max(totalWeight, volumetricWeight);

            // step 2: check if it's a mountain route or not
            bool isMountain = IsMountainRoute(pickupCity, dropCity);
            double terrainFactor = isMountain ? 1.5 : 1.0;

            // step 3: pick the right vehicle for the job
            var vehicle = SelectVehicle(chargeableWeight, distanceKm, isMountain);

            // NEW: Calculate how many vehicles needed if weight exceeds capacity
            int vehiclesNeeded = 1;
            decimal weightPerVehicle = chargeableWeight;
            
            if ((double)chargeableWeight > vehicle.MaxCapacityKg)
            {
                // Split load across multiple vehicles
                vehiclesNeeded = (int)Math.Ceiling((double)chargeableWeight / vehicle.MaxCapacityKg);
                weightPerVehicle = chargeableWeight / vehiclesNeeded;
            }

            // step 4: IMPROVED fuel calculation - realistic non-linear formula
            // Calculate for ONE vehicle, then multiply by number of vehicles
            double loadPercentage = (double)weightPerVehicle / vehicle.MaxCapacityKg;
            double loadFactor = 1.0 + Math.Pow(loadPercentage, 1.5) * 0.15;
            loadFactor = Math.Min(loadFactor, 1.25); // Cap at 25% increase

            // step 5: fuel cost calculation (per vehicle)
            double adjustedConsumption = vehicle.FuelConsumptionPer100Km * loadFactor * terrainFactor;
            double fuelLitersPerVehicle = (distanceKm / 100) * adjustedConsumption;
            double fuelCostPerVehicle = fuelLitersPerVehicle * DieselPricePerLiter;

            // step 6: driver cost (per vehicle)
            double driverCostPerVehicle = durationHours * vehicle.DriverHourlyRate;

            // step 7: toll charges (per vehicle)
            double tollCostPerVehicle = distanceKm > 100 ? distanceKm * TollRatePerKm : 0;

            // step 8: maintenance costs (per vehicle)
            double maintenanceFactor = 1.0 + (loadPercentage - 0.5) * 0.3;
            maintenanceFactor = Math.Max(1.0, maintenanceFactor);
            double maintenanceCostPerVehicle = distanceKm * vehicle.MaintenanceCostPerKm * maintenanceFactor;

            // step 9: MULTIPLY by number of vehicles
            double totalFuelCost = fuelCostPerVehicle * vehiclesNeeded;
            double totalFuelLiters = fuelLitersPerVehicle * vehiclesNeeded;
            double totalDriverCost = driverCostPerVehicle * vehiclesNeeded;
            double totalTollCost = tollCostPerVehicle * vehiclesNeeded;
            double totalMaintenanceCost = maintenanceCostPerVehicle * vehiclesNeeded;

            double subtotal = totalFuelCost + totalDriverCost + totalTollCost + totalMaintenanceCost;

            // step 10: insurance
            double insuranceRate = 0.02;
            if (isFragile) insuranceRate += 0.015;
            if (isHighValue) insuranceRate += 0.025;
            double insuranceCost = subtotal * insuranceRate;

            // step 11: business overhead
            double overhead = (subtotal + insuranceCost) * 0.10;

            // step 12: final total
            double totalCost = subtotal + insuranceCost + overhead;

            return new CostBreakdown
            {
                VehicleType = vehiclesNeeded > 1 
                    ? $"{vehiclesNeeded}x {vehicle.Name}" 
                    : vehicle.Name,
                ChargeableWeightKg = (double)chargeableWeight,
                ActualWeightKg = (double)totalWeight,
                VolumetricWeightKg = (double)volumetricWeight,

                FuelCost = Math.Round(totalFuelCost, 0),
                FuelLiters = Math.Round(totalFuelLiters, 1),
                DriverCost = Math.Round(totalDriverCost, 0),
                TollCost = Math.Round(totalTollCost, 0),
                MaintenanceCost = Math.Round(totalMaintenanceCost, 0),
                InsuranceCost = Math.Round(insuranceCost, 0),
                OverheadCost = Math.Round(overhead, 0),
                TotalCost = Math.Round(totalCost, 0),

                TerrainType = isMountain ? "Mountain" : "Plain",
                LoadFactor = Math.Round(loadFactor, 2),
                VehiclesNeeded = vehiclesNeeded // NEW: Track number of vehicles
            };
        }

        private VehicleConfig SelectVehicle(decimal chargeableWeight, double distanceKm, bool isMountain)
        {
            // mountain routes always get the 4x4, no questions asked
            if (isMountain) return Vehicles["4x4"];

            // picking vehicle based on how heavy the stuff is
            if (chargeableWeight > 16000) return Vehicles["MAT"];
            if (chargeableWeight > 7500) return Vehicles["HDT"];
            if (chargeableWeight > 2000) return Vehicles["MGV"];
            if (chargeableWeight > 500 && distanceKm > 150) return Vehicles["MGV"];
            return Vehicles["LCV"];
        }

        private bool IsMountainRoute(string pickup, string drop)
        {
            var mountainAreas = new[] { "Ooty", "Manali", "Shimla", "Munnar", "Kodaikanal", "Darjeeling", "Coorg", "Mussoorie" };
            return mountainAreas.Any(m =>
                (pickup?.Contains(m, StringComparison.OrdinalIgnoreCase) ?? false) ||
                (drop?.Contains(m, StringComparison.OrdinalIgnoreCase) ?? false));
        }
    }

    public record VehicleConfig(
        string Name,
        int MaxCapacityKg,
        double FuelConsumptionPer100Km,
        double MaintenanceCostPerKm,
        double DriverHourlyRate);

    public class CostBreakdown
    {
        public string VehicleType { get; set; }
        public double ChargeableWeightKg { get; set; }
        public double ActualWeightKg { get; set; }
        public double VolumetricWeightKg { get; set; }

        public double FuelCost { get; set; }
        public double FuelLiters { get; set; }
        public double DriverCost { get; set; }
        public double TollCost { get; set; }
        public double MaintenanceCost { get; set; }
        public double InsuranceCost { get; set; }
        public double OverheadCost { get; set; }
        public double TotalCost { get; set; }


        public string TerrainType { get; set; }
        public double LoadFactor { get; set; }
        public int VehiclesNeeded { get; set; } = 1;
    }
}
