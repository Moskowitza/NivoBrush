import React from 'react';
import PropTypes from 'prop-types';
import { Defs } from '@nivo/core/lib/components/defs';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers.js'
import toClass from 'recompose/toClass.js'

const SvgWrapper = ({ width, height, margin, defs, children, getSvgRef }) => {
    var childrenWithProps = React.Children.map(children, child => {
        if (child === null) return child;
        return React.cloneElement(child, { getSvgRef });
    });
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            ref={svgRef => (this.svg = svgRef)}
        >
            <Defs defs={defs}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                    {childrenWithProps}
                </g>
            </Defs>
        </svg>
    );
};
SvgWrapper.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    margin: PropTypes.shape({
        top: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired
    }).isRequired,
    defs: PropTypes.array
};

var enhance = compose(
    toClass,
    withHandlers({
        getSvgRef: () => () => this.svg
    }),
    pure
);

var EnahancedSvgWrapper = enhance(SvgWrapper);
EnahancedSvgWrapper.displayName = 'enhanced(SvgWrapper)';

export default EnahancedSvgWrapper;