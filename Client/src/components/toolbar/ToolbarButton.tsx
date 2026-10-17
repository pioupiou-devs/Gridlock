type ToolbarButtonProps = {
    label: string;
    onClick?: () => void;
    title?: string;
    selected?: boolean;
};

function ToolbarButton({ label, onClick, title, selected = false }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            className={selected ? 'toolbar-button selected' : 'toolbar-button'}
            onClick={onClick}
            title={title ?? label}
            aria-label={title ?? label}
            aria-pressed={selected}
        >
            {label}
        </button>
    );
}

export default ToolbarButton;
