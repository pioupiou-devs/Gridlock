import ToolbarButton from "./ToolbarButton";

type ButtonHolderProps = {
    labels: string[];
};

function ButtonHolder({ labels }: ButtonHolderProps) {
    return (
        <div className="button-holder">
            {labels.map((label) => (
                <ToolbarButton
                    key={label}
                    label={label}
                    onClick={() => {
                        console.log(`Toolbar button clicked: ${label}`);
                    }}
                />
            ))}
        </div>
    );
}

export default ButtonHolder;
