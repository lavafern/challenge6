-- CreateTable
CREATE TABLE "Gambar" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "Gambar_pkey" PRIMARY KEY ("id")
);
