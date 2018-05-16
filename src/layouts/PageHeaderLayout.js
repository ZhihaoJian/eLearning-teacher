import React from 'react';
import PageHeader from 'ant-design-pro/lib/PageHeader';


export default ({ children, ...restProps }) => (
    <div style={{ margin: '-24px -24px 0' }} >
        <PageHeader key="pageheader" {...restProps} />
        {children ? <div style={{ margin: '24px 24px 0' }} >{children}</div> : null}
    </div>
)