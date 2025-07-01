export const RecipeNotes = ({ notes }: { notes: string }) => (
  <div className="mb-10 text-sm text-muted-foreground">
    <h3 className="text-lg font-semibold mb-2">Author Notes</h3>
    <p>{notes}</p>
  </div>
);
