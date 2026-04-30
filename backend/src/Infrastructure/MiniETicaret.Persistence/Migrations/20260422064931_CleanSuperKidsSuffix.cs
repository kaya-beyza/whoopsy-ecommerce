using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiniETicaret.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CleanSuperKidsSuffix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "Products"
                SET "Description" = REPLACE("Description", ' | SuperKids''te !', '')
                WHERE "Description" LIKE '%| SuperKids''te !%';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // NOT: 929 ürünün hangileri olduğunu saklamadığımız için suffix geri eklenmez.
        }
    }
}
