export const RecipeFooter = ({ brewedCount }: { brewedCount?: number }) => {
  if (brewedCount === undefined) return null;

  return (
    <div className="text-sm text-center text-muted-foreground border-t pt-8">
      Brewed by community: <span className="font-medium">{brewedCount}</span>{" "}
      times
    </div>
  );
};
