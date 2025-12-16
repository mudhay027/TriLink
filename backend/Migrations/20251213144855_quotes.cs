using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class quotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BuyerLogisticsJobQuotes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JobId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LogisticsProviderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuoteAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EstimatedDeliveryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuyerLogisticsJobQuotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BuyerLogisticsJobQuotes_BuyerLogisticsJobs_JobId",
                        column: x => x.JobId,
                        principalTable: "BuyerLogisticsJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BuyerLogisticsJobQuotes_Users_LogisticsProviderId",
                        column: x => x.LogisticsProviderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BuyerLogisticsJobQuotes_JobId",
                table: "BuyerLogisticsJobQuotes",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_BuyerLogisticsJobQuotes_LogisticsProviderId",
                table: "BuyerLogisticsJobQuotes",
                column: "LogisticsProviderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BuyerLogisticsJobQuotes");
        }
    }
}
