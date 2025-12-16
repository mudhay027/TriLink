using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class logistics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BuyerLogisticsJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BuyerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PickupAddressLine1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PickupAddressLine2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PickupLandmark = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PickupCity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PickupState = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PickupPincode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DropAddressLine1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DropAddressLine2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DropLandmark = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DropCity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DropState = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DropPincode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PickupDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PickupTimeSlot = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeliveryExpectedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeliveryTimeWindow = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShipmentPriority = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PalletCount = table.Column<int>(type: "int", nullable: false),
                    TotalWeight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Length = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Width = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Height = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    MaterialType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsFragile = table.Column<bool>(type: "bit", nullable: false),
                    IsHighValue = table.Column<bool>(type: "bit", nullable: false),
                    SpecialHandling = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EwayBillNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InvoiceNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GstNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaterialCategory = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SenderName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SenderMobile = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SenderEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuyerLogisticsJobs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BuyerLogisticsJobs_Users_BuyerId",
                        column: x => x.BuyerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BuyerLogisticsJobs_BuyerId",
                table: "BuyerLogisticsJobs",
                column: "BuyerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BuyerLogisticsJobs");
        }
    }
}
