import React, { useContext, useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Map, View, Picker } from '@tarojs/components'
import {
  AtInput,
  AtButton,
  AtIcon
} from 'taro-ui'
import { Selector, Toast } from '@/types/common'
import {
  INIT_STATE_SELECTOR,
  INIT_STATE_LOCATION,
  InitToast,
  LoadingToast,
  SuccessMessage,
  WarningMessage
} from '@/config/constant'
import { AppContext } from '@/config/context'
import CommonPage from '@/components/Common/Page'
import { Farmer } from '@/pages/farmer/model'
import { addOrUpdateFarmer, getFarmerById } from '@/pages/farmer/service'
import MarkerRed from '@/assets/images/MarkerRed.png'

import '../index.scss'

const INIT_STATE_FARMER: Farmer = {
  name: "",
  idnum: "",
  phone: "",
  obj: "",
  toiletChange: "",
  committee: {
    _id: "",
    name: ""
  },
  group: "",
  location: INIT_STATE_LOCATION,
  address: "",
  septicTank: "",
  fillingDate: "",
  toiletArea: "",
  effectiveVolume: "",
  status: 'incomplete'
}

const Index: React.FC = () => {
  const appContext = useContext(AppContext)
  const [toast, setToast] = useState<Toast>(InitToast)
  const [farmer, setFarmer] = useState<Farmer>(INIT_STATE_FARMER)
  const [selector, setSelector] = useState<Selector>(INIT_STATE_SELECTOR)

  useEffect(() => {
    const CurdInit = async () => {
      setToast(LoadingToast)
      const { id, type } = getCurrentInstance().router?.params as { id: string, type: string }
      if (id && type == 'update') {
        const res = await getFarmerById(id) as Farmer
        setFarmer(res)
      }
      else if (!id && type == 'create') { }
      setToast(InitToast)
    }
    CurdInit()
  }, [])

  const handleInputFarmer = (stateName, value): void => {
    setFarmer({ ...farmer, [stateName]: value })
  }

  const onSubmit = async () => {
    try {
      const res: any = await addOrUpdateFarmer(farmer)
      if (res._id) setFarmer({ ...farmer, _id: res._id })
      Taro.atMessage(SuccessMessage)
    } catch {
      Taro.atMessage(WarningMessage)
    }
  }

  return (
    <CommonPage toast={toast}>
      <View className='panel'>
        <View className='panel-title'>????????????</View>
        <View className='panel-content'>
          <AtInput
            required
            name='name'
            title='????????????'
            type='text'
            placeholder='?????????????????????'
            value={farmer.name}
            onChange={handleInputFarmer.bind(this, 'name')}
          />
          <AtInput
            required
            name='idnum'
            title='????????????'
            type='idcard'
            placeholder='?????????????????????'
            value={farmer.idnum}
            onChange={handleInputFarmer.bind(this, 'idnum')}
          />
          <AtInput
            required
            name='phone'
            title='????????????'
            type='phone'
            placeholder='?????????????????????'
            value={farmer.phone}
            onChange={handleInputFarmer.bind(this, 'phone')}
          />
        </View>
        <View className='panel-title'>????????????</View>
        <View className='panel-content'>
          <Picker
            mode='selector'
            range={selector.obj}
            value={selector.obj.indexOf(farmer.obj)}
            onChange={
              (e) => {
                setFarmer({
                  ...farmer,
                  obj: selector.obj[e.detail.value]
                })
              }}>
            <AtInput
              required
              editable={false}
              name='obj'
              title='????????????'
              type='text'
              placeholder='?????????????????????'
              value={farmer.obj}
              onChange={() => { }}
            />
          </Picker>
          <Picker
            mode='selector'
            range={selector.toiletChange}
            value={selector.toiletChange.indexOf(farmer.toiletChange)}
            onChange={
              (e) => {
                setFarmer({
                  ...farmer,
                  toiletChange: selector.toiletChange[e.detail.value]
                })
              }}>
            <AtInput
              required
              editable={false}
              name='toiletChange'
              title='????????????'
              type='text'
              placeholder='?????????????????????'
              value={farmer.toiletChange}
              onChange={() => { }}
            />
          </Picker>
          <AtInput
            required
            name='group'
            title='??????(??????)'
            type='text'
            placeholder='???????????????(??????)'
            value={farmer.group}
            onChange={handleInputFarmer.bind(this, 'group')}
          />
          <Picker
            mode='selector'
            range={selector.septicTank}
            value={selector.septicTank.indexOf(farmer.septicTank)}
            onChange={
              (e) => {
                setFarmer({
                  ...farmer,
                  septicTank: selector.septicTank[e.detail.value]
                })
              }} >
            <AtInput
              required
              editable={false}
              name='septicTank'
              title='????????????'
              type='text'
              placeholder='????????????????????????'
              value={farmer.septicTank}
              onChange={() => { }}
            />
          </Picker>
          <Picker
            mode='date'
            value={farmer.fillingDate}
            onChange={
              (e) => {
                setFarmer({
                  ...farmer,
                  fillingDate: e.detail.value
                })
              }}>
            <AtInput
              required
              editable={false}
              name='fillingDate'
              title='????????????'
              type='text'
              placeholder='?????????????????????'
              value={farmer.fillingDate}
              onChange={() => { }}
            />
          </Picker>
          <AtInput
            required
            name='toiletArea'
            title='????????????'
            type='number'
            placeholder='?????????????????????(??????)'
            value={farmer.toiletArea}
            onChange={handleInputFarmer.bind(this, 'toiletArea')}
          />
          <AtInput
            required
            name='effectiveVolume'
            title='????????????'
            type='number'
            placeholder='???????????????????????????(??????)'
            value={farmer.effectiveVolume}
            onChange={handleInputFarmer.bind(this, 'effectiveVolume')}
          />
          <AtInput
            required
            editable={false}
            name='location'
            title='????????????'
            type='text'
            placeholder='?????????????????????'
            value={farmer.location?.address}
            onClick={() => {
              Taro.chooseLocation({
                success: (location) => {
                  setFarmer({
                    ...farmer,
                    address: location.name,
                    location: {
                      name: location.name,
                      address: location.address,
                      latitude: location.latitude as unknown as number,
                      longitude: location.longitude as unknown as number,
                    }
                  })
                }
              })
            }}
            onChange={() => { }}
          >
            <AtIcon value='map-pin' size='30' />
          </AtInput>
          <AtInput
            required
            name='address'
            title='????????????'
            type='text'
            placeholder='?????????????????????'
            value={farmer.address}
            onChange={handleInputFarmer.bind(this, 'address')}
          />
        </View>
        <View className='panel-title'>????????????</View>
        <View className='panel-content'>
          <View className='map-wrap'>
            <View className='map-cover'>
              <Map
                className='map'
                longitude={farmer.location.longitude}
                latitude={farmer.location.latitude}
                subkey='XQHBZ-5XKKU-LLGVQ-4EYNQ-XNKOQ-4HFLS'
                layerStyle={1}
                onTap={(res) => { console.log(res) }}
                markers={[{
                  id: 0,
                  longitude: farmer.location.longitude,
                  latitude: farmer.location.latitude,
                  iconPath: MarkerRed,
                  title: farmer.location.address,
                  width: 32,
                  height: 32
                }]}
              />
            </View>
          </View>
        </View>
        <AtButton type='primary' className='form-btn' onClick={onSubmit}>????????????</AtButton>
      </View>
    </CommonPage>
  )
}

export default Index