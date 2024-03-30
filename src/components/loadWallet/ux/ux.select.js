import { useEffect, useState } from 'react';
import { getUniqueWallets, getUniqueTypes } from '../../../lib/functions/wallets';

const SelectUX = ({
    tableData
} = {}) => {

    const [filterWallets, setFilterWallets] = useState([]);
    const [filterTypes, setFilterTypes] = useState([]);

    useEffect(() => {
        if (tableData.length > 0) {
            setFilterWallets(getUniqueWallets(tableData));
            setFilterTypes(getUniqueTypes(tableData));
        }
    }, [tableData]);

    return {
        filterTypes,
        filterWallets,
    }

}

export default SelectUX;
