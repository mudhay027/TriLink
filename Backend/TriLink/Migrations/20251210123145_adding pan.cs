using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TriLink.Migrations
{
    /// <inheritdoc />
    public partial class addingpan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GstCertificatePath",
                table: "Users",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PanCardPath",
                table: "Users",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PanNumber",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GstCertificatePath",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PanCardPath",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PanNumber",
                table: "Users");
        }
    }
}
