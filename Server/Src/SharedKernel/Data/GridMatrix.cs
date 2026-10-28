using SharedKernel.Enum;

namespace SharedKernel.Data
{
    public class GridMatrix(int size)
    {
        private readonly int size = size;
        private readonly byte[] grid = new byte[size * size];

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

        private int CalculateIndex(int x, int y) => (y * size) + x;
    }
}