using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiniETicaret.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixCategoryTurkishCharsAndCleanProductDescriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "Categories" SET "Name" = 'Ayakkabı'        WHERE "Name" = 'Ayakkabi';
                UPDATE "Categories" SET "Name" = 'Çanta'           WHERE "Name" = 'Canta';
                UPDATE "Categories" SET "Name" = 'Diğer'           WHERE "Name" = 'Diger';
                UPDATE "Categories" SET "Name" = 'Eşofman Altı'    WHERE "Name" = 'Esofman Alti';
                UPDATE "Categories" SET "Name" = 'Eşofman Takımı'  WHERE "Name" = 'Esofman Takimi';
                UPDATE "Categories" SET "Name" = 'Eşofman Üstü'    WHERE "Name" = 'Esofman Ustu';
                UPDATE "Categories" SET "Name" = 'Şapka'           WHERE "Name" = 'Sapka';
                UPDATE "Categories" SET "Name" = 'Şort'            WHERE "Name" = 'Sort';
                """);

            migrationBuilder.Sql("""
                UPDATE "Categories"
                SET "Description" = 'Spor ayakkabı, sneaker, bot, terlik, sandalet'
                WHERE "Description" = 'Spor ayakkabi, sneaker, bot, terlik, sandalet';

                UPDATE "Categories"
                SET "Description" = 'Çanta, çorap, şapka, cüzdan, kemer'
                WHERE "Description" = 'Canta, corap, sapka, cuzdan, kemer';

                UPDATE "Categories"
                SET "Description" = 'Diğer ürünler'
                WHERE "Description" = 'Diger urunler';

                UPDATE "Categories"
                SET "Description" = 'T-shirt, sweatshirt, eşofman, mont, şort, pantolon'
                WHERE "Description" = 'T-shirt, sweatshirt, esofman, mont, sort, pantolon';
                """);

            migrationBuilder.Sql("""
                UPDATE "Products"
                SET "Description" = REPLACE("Description", ' | SuperStep''te !', '')
                WHERE "Description" LIKE '%| SuperStep''te !%';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "Categories" SET "Name" = 'Ayakkabi'       WHERE "Name" = 'Ayakkabı';
                UPDATE "Categories" SET "Name" = 'Canta'          WHERE "Name" = 'Çanta';
                UPDATE "Categories" SET "Name" = 'Diger'          WHERE "Name" = 'Diğer';
                UPDATE "Categories" SET "Name" = 'Esofman Alti'   WHERE "Name" = 'Eşofman Altı';
                UPDATE "Categories" SET "Name" = 'Esofman Takimi' WHERE "Name" = 'Eşofman Takımı';
                UPDATE "Categories" SET "Name" = 'Esofman Ustu'   WHERE "Name" = 'Eşofman Üstü';
                UPDATE "Categories" SET "Name" = 'Sapka'          WHERE "Name" = 'Şapka';
                UPDATE "Categories" SET "Name" = 'Sort'           WHERE "Name" = 'Şort';
                """);

            migrationBuilder.Sql("""
                UPDATE "Categories"
                SET "Description" = 'Spor ayakkabi, sneaker, bot, terlik, sandalet'
                WHERE "Description" = 'Spor ayakkabı, sneaker, bot, terlik, sandalet';

                UPDATE "Categories"
                SET "Description" = 'Canta, corap, sapka, cuzdan, kemer'
                WHERE "Description" = 'Çanta, çorap, şapka, cüzdan, kemer';

                UPDATE "Categories"
                SET "Description" = 'Diger urunler'
                WHERE "Description" = 'Diğer ürünler';

                UPDATE "Categories"
                SET "Description" = 'T-shirt, sweatshirt, esofman, mont, sort, pantolon'
                WHERE "Description" = 'T-shirt, sweatshirt, eşofman, mont, şort, pantolon';
                """);

            // NOT: Products suffix'ini geri eklemiyoruz. Orijinal DB'de 4470 ürünün
            // sadece 3541'inde " | SuperStep'te !" vardı; hangi satırlar olduğunu
            // saklamadığımız için geri yükleme güvensiz olur.
        }
    }
}
