public class GridMatrix
{
    private readonly int size = 48;
    private readonly byte[] grid;

    public int CurrentTick {get; set;}

    public GridMatrix(int size = 48)
    {
        this.size = size;
        grid = new byte[size * size];
    }

    public CellType GetCellType(int x, int y)
    {
        var index = CalculateIndex(x, y);

        // If out of bound, return void
        if (index <= 0 || index > size)
            return CellType.Void;

        var e = grid[index];

        return (CellType)e;
    }

    public void SetCellType(int x, int y, CellType type)
    {
        var index = CalculateIndex(x, y);

        // If out of bound, return void
        if (index <= 0 || index > size) return;

        grid[index] = (byte)type;
    }

    #region Helpers

    private int CalculateIndex(int x, int y) => (y * size) + x;

    #endregion
}