class DetailsUtils {
    static formatText = (input) => {
        return input
            .replace(/wazuh/gi, "")
            .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
            .replace(/([a-z\d])([A-Z])/g, "$1 $2")
            .replace(/_/g, " ")
            .replace(/^\s*/, "")
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .replace(/\b(Ip|ip)\b/g, "IP");
    };
}
export default DetailsUtils;
