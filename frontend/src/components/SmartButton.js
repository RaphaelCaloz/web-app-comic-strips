export default function SmartButton(props) {
    const buttonClass = props.enabled ? 'button-enabled' : 'button-disabled'
    function doNothing() {}
    return (
        <button className={buttonClass} onClick={props.enabled ? props.processClick : doNothing()}>{props.text}</button>
    )
}