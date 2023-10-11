using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarWebShop.Migrations
{
    /// <inheritdoc />
    public partial class NewChangesKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisement_Cars_UserID",
                table: "Advertisement");

            migrationBuilder.DropIndex(
                name: "IX_Advertisement_UserID",
                table: "Advertisement");

            migrationBuilder.DropColumn(
                name: "AdverID",
                table: "Cars");

            migrationBuilder.CreateIndex(
                name: "IX_Advertisement_CarID",
                table: "Advertisement",
                column: "CarID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Advertisement_UserID",
                table: "Advertisement",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisement_Cars_CarID",
                table: "Advertisement",
                column: "CarID",
                principalTable: "Cars",
                principalColumn: "CarID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisement_Cars_CarID",
                table: "Advertisement");

            migrationBuilder.DropIndex(
                name: "IX_Advertisement_CarID",
                table: "Advertisement");

            migrationBuilder.DropIndex(
                name: "IX_Advertisement_UserID",
                table: "Advertisement");

            migrationBuilder.AddColumn<int>(
                name: "AdverID",
                table: "Cars",
                type: "int",
                nullable: false,
                defaultValue: 0);

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
    }
}
