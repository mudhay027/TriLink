using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TriLink.Migrations
{
    /// <inheritdoc />
    public partial class AddAllRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RouteSuggestions_LogisticsJobId",
                table: "RouteSuggestions",
                column: "LogisticsJobId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_SupplierId",
                table: "Products",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderStatusHistories_ChangedByUserId",
                table: "OrderStatusHistories",
                column: "ChangedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderStatusHistories_OrderId",
                table: "OrderStatusHistories",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_BuyerId",
                table: "Orders",
                column: "BuyerId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OfferThreadId",
                table: "Orders",
                column: "OfferThreadId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ProductId",
                table: "Orders",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_SupplierId",
                table: "Orders",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_OfferThreads_BuyerId",
                table: "OfferThreads",
                column: "BuyerId");

            migrationBuilder.CreateIndex(
                name: "IX_OfferThreads_ProductId",
                table: "OfferThreads",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_OfferThreads_SupplierId",
                table: "OfferThreads",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_OfferMessages_SenderUserId",
                table: "OfferMessages",
                column: "SenderUserId");

            migrationBuilder.CreateIndex(
                name: "IX_OfferMessages_ThreadId",
                table: "OfferMessages",
                column: "ThreadId");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsQuotes_LogisticsJobId",
                table: "LogisticsQuotes",
                column: "LogisticsJobId");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsQuotes_LogisticsPartnerId",
                table: "LogisticsQuotes",
                column: "LogisticsPartnerId");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsJobs_OrderId",
                table: "LogisticsJobs",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_OrderId",
                table: "Documents",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Orders_OrderId",
                table: "Documents",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LogisticsJobs_Orders_OrderId",
                table: "LogisticsJobs",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LogisticsQuotes_LogisticsJobs_LogisticsJobId",
                table: "LogisticsQuotes",
                column: "LogisticsJobId",
                principalTable: "LogisticsJobs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LogisticsQuotes_Users_LogisticsPartnerId",
                table: "LogisticsQuotes",
                column: "LogisticsPartnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferMessages_OfferThreads_ThreadId",
                table: "OfferMessages",
                column: "ThreadId",
                principalTable: "OfferThreads",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferMessages_Users_SenderUserId",
                table: "OfferMessages",
                column: "SenderUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferThreads_Products_ProductId",
                table: "OfferThreads",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferThreads_Users_BuyerId",
                table: "OfferThreads",
                column: "BuyerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferThreads_Users_SupplierId",
                table: "OfferThreads",
                column: "SupplierId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_OfferThreads_OfferThreadId",
                table: "Orders",
                column: "OfferThreadId",
                principalTable: "OfferThreads",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Products_ProductId",
                table: "Orders",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_BuyerId",
                table: "Orders",
                column: "BuyerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_SupplierId",
                table: "Orders",
                column: "SupplierId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderStatusHistories_Orders_OrderId",
                table: "OrderStatusHistories",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderStatusHistories_Users_ChangedByUserId",
                table: "OrderStatusHistories",
                column: "ChangedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Users_SupplierId",
                table: "Products",
                column: "SupplierId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RouteSuggestions_LogisticsJobs_LogisticsJobId",
                table: "RouteSuggestions",
                column: "LogisticsJobId",
                principalTable: "LogisticsJobs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Orders_OrderId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_LogisticsJobs_Orders_OrderId",
                table: "LogisticsJobs");

            migrationBuilder.DropForeignKey(
                name: "FK_LogisticsQuotes_LogisticsJobs_LogisticsJobId",
                table: "LogisticsQuotes");

            migrationBuilder.DropForeignKey(
                name: "FK_LogisticsQuotes_Users_LogisticsPartnerId",
                table: "LogisticsQuotes");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferMessages_OfferThreads_ThreadId",
                table: "OfferMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferMessages_Users_SenderUserId",
                table: "OfferMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferThreads_Products_ProductId",
                table: "OfferThreads");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferThreads_Users_BuyerId",
                table: "OfferThreads");

            migrationBuilder.DropForeignKey(
                name: "FK_OfferThreads_Users_SupplierId",
                table: "OfferThreads");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_OfferThreads_OfferThreadId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Products_ProductId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_BuyerId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_SupplierId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderStatusHistories_Orders_OrderId",
                table: "OrderStatusHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderStatusHistories_Users_ChangedByUserId",
                table: "OrderStatusHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Users_SupplierId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_RouteSuggestions_LogisticsJobs_LogisticsJobId",
                table: "RouteSuggestions");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_RouteSuggestions_LogisticsJobId",
                table: "RouteSuggestions");

            migrationBuilder.DropIndex(
                name: "IX_Products_SupplierId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_OrderStatusHistories_ChangedByUserId",
                table: "OrderStatusHistories");

            migrationBuilder.DropIndex(
                name: "IX_OrderStatusHistories_OrderId",
                table: "OrderStatusHistories");

            migrationBuilder.DropIndex(
                name: "IX_Orders_BuyerId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_OfferThreadId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_ProductId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_SupplierId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_OfferThreads_BuyerId",
                table: "OfferThreads");

            migrationBuilder.DropIndex(
                name: "IX_OfferThreads_ProductId",
                table: "OfferThreads");

            migrationBuilder.DropIndex(
                name: "IX_OfferThreads_SupplierId",
                table: "OfferThreads");

            migrationBuilder.DropIndex(
                name: "IX_OfferMessages_SenderUserId",
                table: "OfferMessages");

            migrationBuilder.DropIndex(
                name: "IX_OfferMessages_ThreadId",
                table: "OfferMessages");

            migrationBuilder.DropIndex(
                name: "IX_LogisticsQuotes_LogisticsJobId",
                table: "LogisticsQuotes");

            migrationBuilder.DropIndex(
                name: "IX_LogisticsQuotes_LogisticsPartnerId",
                table: "LogisticsQuotes");

            migrationBuilder.DropIndex(
                name: "IX_LogisticsJobs_OrderId",
                table: "LogisticsJobs");

            migrationBuilder.DropIndex(
                name: "IX_Documents_OrderId",
                table: "Documents");
        }
    }
}
