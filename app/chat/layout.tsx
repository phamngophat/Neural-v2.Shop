export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Drop the z-50 fixed overlay so the root navbar isn't completely nuked,
    // OR design the chat page as a complete standalone screen.
    // The user wants a "professional pro" look, so standalone full-screen with custom header is best.
    return (
        <div className="fixed inset-0 z-[9999] bg-slate-50 overflow-hidden flex flex-col h-screen">
            {children}
        </div>
    );
}
