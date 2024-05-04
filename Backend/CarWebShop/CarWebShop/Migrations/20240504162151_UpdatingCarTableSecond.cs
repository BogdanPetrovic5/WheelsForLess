using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarWebShop.Migrations
{
    /// <inheritdoc />
    public partial class UpdatingCarTableSecond : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Mileage",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Mileage",
                table: "CarDto",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Mileage",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "Mileage",
                table: "CarDto");
        }
    }
}
