using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddRouteDataColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedDate",
                table: "BuyerLogisticsJobs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CostBreakdownJson",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DestinationCoords",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DriverExperience",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OriginCoords",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlannedDistance",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlannedDuration",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RouteGeometry",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VehicleType",
                table: "BuyerLogisticsJobs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedDate",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "CostBreakdownJson",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "DestinationCoords",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "DriverExperience",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "OriginCoords",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "PlannedDistance",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "PlannedDuration",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "RouteGeometry",
                table: "BuyerLogisticsJobs");

            migrationBuilder.DropColumn(
                name: "VehicleType",
                table: "BuyerLogisticsJobs");
        }
    }
}
