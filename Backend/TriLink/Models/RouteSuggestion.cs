using System.ComponentModel.DataAnnotations;

namespace TriLink.Models
{
    public class RouteSuggestion
    {
        public int Id { get; set; }

        public int LogisticsJobId { get; set; }

        public decimal DistanceKm { get; set; }

        public int EstimatedDurationMin { get; set; }

        public decimal? FuelCostEstimate { get; set; }

        public decimal? CarbonEmissionKg { get; set; }

        [MaxLength(50)]
        public string RouteProvider { get; set; } = "GoogleMaps";

        // Full JSON from API if you want to keep it
        public string? RawRouteJson { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
