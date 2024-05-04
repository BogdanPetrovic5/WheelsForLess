using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarWebShop.Migrations
{
    /// <inheritdoc />
    public partial class UpdatingCarTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EngineVolume",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HorsePower",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Propulsion",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EngineVolume",
                table: "CarDto",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HorsePower",
                table: "CarDto",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Propulsion",
                table: "CarDto",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EngineVolume",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "HorsePower",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "Propulsion",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "EngineVolume",
                table: "CarDto");

            migrationBuilder.DropColumn(
                name: "HorsePower",
                table: "CarDto");

            migrationBuilder.DropColumn(
                name: "Propulsion",
                table: "CarDto");
        }
    }
}
