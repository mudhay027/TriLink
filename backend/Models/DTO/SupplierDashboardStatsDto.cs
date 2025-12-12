namespace Backend.Models.DTO
{
    public class SupplierDashboardStatsDto
    {
        public int TotalActiveProducts { get; set; }
        public int OngoingOrders { get; set; }
        public int CompletedOrders { get; set; }
    }
}
