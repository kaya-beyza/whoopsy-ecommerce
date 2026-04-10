using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiniETicaret.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddBrandToProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Brand",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Brand",
                table: "Products");
        }
    }
}
