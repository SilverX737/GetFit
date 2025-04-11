// Get all exercises
app.get("/api/exercises", async (req, res) => {
    try {
        const exercises = await prisma.exercise.findMany({
            include: { workout: true }, // Include related workout
        });
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create an exercise (linked to a workout)
app.post("/api/exercises", async (req, res) => {
    const { name, sets, reps, workoutId } = req.body;
    try {
        const newExercise = await prisma.exercise.create({
            data: { name, sets, reps, workoutId: parseInt(workoutId) },
        });
        res.json(newExercise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an exercise
app.put("/api/exercises/:id", async (req, res) => {
    const { id } = req.params;
    const { name, sets, reps } = req.body;
    try {
        const updatedExercise = await prisma.exercise.update({
            where: { id: parseInt(id) },
            data: { name, sets, reps },
        });
        res.json(updatedExercise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an exercise
app.delete("/api/exercises/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.exercise.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: "Exercise deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
