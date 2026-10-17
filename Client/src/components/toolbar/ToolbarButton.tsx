type ToolbarButtonProps = {
    label: string;
    onClick?: () => void;
};

function ToolbarButton({ label, onClick }: ToolbarButtonProps) {
    return (
        <button type="button" className="toolbar-button" onClick={onClick}>
            {label}
        </button>
    );
}

export default ToolbarButton;
