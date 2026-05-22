const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) {
        return <>{text}</>;
    }

    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const pattern = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
    const parts = text.split(pattern);

    return (
        <span>
            {parts.map((part, index) =>
                pattern.test(part) ? (
                    <span key={index} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">
                        {part}
                    </span>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </span>
    );
};


export default HighlightText;