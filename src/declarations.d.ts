declare module 'react-barcode' {
    import React from 'react';

    interface BarcodeProps {
        value: string;
        renderer?: 'canvas' | 'img' | 'svg';
        width?: number;
        height?: number;
        format?: string;
        displayValue?: boolean;
        fontOptions?: string;
        font?: string;
        textAlign?: string;
        textPosition?: string;
        textMargin?: number;
        fontSize?: number;
        background?: string;
        lineColor?: string;
        margin?: number;
        marginTop?: number;
        marginBottom?: number;
        marginLeft?: number;
        marginRight?: number;
        className?: string;
    }

    const Barcode: React.ComponentType<BarcodeProps>;
    export default Barcode;
}
