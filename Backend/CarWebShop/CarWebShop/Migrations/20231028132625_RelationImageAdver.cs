using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarWebShop.Migrations
{
    /// <inheritdoc />
    public partial class RelationImageAdver : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ImagePaths",
                columns: table => new
                {
                    ImagePath = table.Column<string>(type: "nvarchar(900)", nullable: false),
                    AdverID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImagePaths", x => x.ImagePath);
                    table.ForeignKey(
                        name: "FK_ImagePaths_Advertisement_AdverID",
                        column: x => x.AdverID,
                        principalTable: "Advertisement",
                        principalColumn: "AdverID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ImagePaths_AdverID",
                table: "ImagePaths",
                column: "AdverID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ImagePaths");
        }
    }
}
