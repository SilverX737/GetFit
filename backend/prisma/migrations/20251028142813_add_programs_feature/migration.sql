-- AlterTable
ALTER TABLE "ExerciseLog" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "current_program_day" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "current_program_id" INTEGER;

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramDay" (
    "id" SERIAL NOT NULL,
    "program_id" INTEGER NOT NULL,
    "day_name" TEXT NOT NULL,
    "day_order" INTEGER NOT NULL,

    CONSTRAINT "ProgramDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramExercise" (
    "id" SERIAL NOT NULL,
    "program_day_id" INTEGER NOT NULL,
    "exercise_name" TEXT NOT NULL,
    "target_sets" INTEGER NOT NULL,
    "target_reps" TEXT NOT NULL,

    CONSTRAINT "ProgramExercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_current_program_id_fkey" FOREIGN KEY ("current_program_id") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramDay" ADD CONSTRAINT "ProgramDay_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramExercise" ADD CONSTRAINT "ProgramExercise_program_day_id_fkey" FOREIGN KEY ("program_day_id") REFERENCES "ProgramDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
