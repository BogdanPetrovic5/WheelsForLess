using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarWebShop.Migrations
{
    /// <inheritdoc />
    public partial class NewMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cars_Advertisement_AdverID",
                table: "Cars");

            migrationBuilder.DropIndex(
                name: "IX_Cars_AdverID",
                table: "Cars");

            migrationBuilder.DropIndex(
                name: "IX_Advertisement_UserID",
                table: "Advertisement");

            migrationBuilder.CreateIndex(
                name: "IX_Advertisement_UserID",
                table: "Advertisement",
                column: "UserID",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisement_Cars_UserID",
                table: "Advertisement",
                column: "UserID",
                principalTable: "Cars",
                principalColumn: "CarID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisement_Cars_UserID",
                table: "Advertisement");

            migrationBuilder.DropIndex(
                name: "IX_Advertisement_UserID",
                table: "Advertisement");

            migrationBuilder.CreateIndex(
                name: "IX_Cars_AdverID",
                table: "Cars",
                column: "AdverID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Advertisement_UserID",
                table: "Advertisement",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Cars_Advertisement_AdverID",
                table: "Cars",
                column: "AdverID",
                principalTable: "Advertisement",
                principalColumn: "AdverID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
