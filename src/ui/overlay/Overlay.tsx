import { useOverlay } from "@/context/OverlayContext";

const Overlay = () => {
    const { isOverlayed } = useOverlay();
    return <div className={`overlay ${isOverlayed ? "active" : ""}`} />
}

export default Overlay;