import React, { forwardRef } from 'react';
import { Text } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import SelectAddOns from "./select-add-ons";
import AddAccessories from "./add-accessories";
import AddAddress from "./add-address";
import SelectAddress from "./select-address";
import AddBike from './add-bike';

const CustomBottomSheet = forwardRef((props, ref) => {
    const {
        contentType, pricing, activeStep = 1, updateQuantity, openQuantityModal = false, couponData, applyCoupon, setCouponData,
        addAddress, newAddress, setNewAddress, openAddressModal, setOpenAddressModal,addNewAddress,
        addOnData, setSelectedAddOns, closeBottomSheet, setData, setSelectedAccessories, accessories,setSelectedAddress,fetchSavedVechiclesData
    } = props;
    const renderContent = () => {
        switch (contentType) {
            case 'addons':
                return (<SelectAddOns setData={setData} data={addOnData} setSelectedAddOns={setSelectedAddOns} closeBottomSheet={closeBottomSheet} />)
            case 'accessories':
                return (<AddAccessories data={accessories} setSelectedAccessories={setSelectedAccessories} closeBottomSheet={closeBottomSheet} />)
            case 'select_address':
                return (<SelectAddress  addNewAddress={addNewAddress} setSelectedAddress={setSelectedAddress} closeBottomSheet={closeBottomSheet} />)
          
                case 'add_bike':
                return (<AddBike fetchData={fetchSavedVechiclesData} closeBottomSheet={closeBottomSheet} />)
                
                case 'addUpdateAddress':
                return <AddAddress
                    addAddress={addAddress} newAddress={newAddress} setNewAddress={setNewAddress}
                    openAddressModal={openAddressModal}
                    setOpenAddressModal={setOpenAddressModal}
                />;

            default:
                return null;
        }
    };

    return (
        <RBSheet
            ref={ref}
            height={props.height}
            minClosingHeight={110}
            openDuration={props.openDuration}>
            <>
                {renderContent()}
            </>
        </RBSheet>
    );
});

export default CustomBottomSheet;
