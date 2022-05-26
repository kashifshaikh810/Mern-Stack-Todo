import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import DeleteIcon from 'react-native-vector-icons/AntDesign';
import EditIcon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const Home = props => {
  const [val, setVal] = useState('');
  const [isShowAddList, setIsShowAddList] = useState(false);
  const [isDeleted, setIsDeleted] = useState({deleted: false, index: ''});
  const [listsData, setListsData] = useState([]);
  const [isUpdatVal, setIsUpdatVal] = useState({show: false, data: {}});
  const [isUserLogOut, setIsUserLogOut] = useState(false);

  const addList = async () => {
    if (val) {
      let value = false;
      let user = await AsyncStorage.getItem('id');
      let id = JSON.parse(user).id;
      setIsShowAddList(true);
      fetch('http://192.168.0.106:8080/add-list', {
        method: 'post',
        body: JSON.stringify({title: val, edited: value, userId: id}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          setVal('');
          setIsShowAddList(false);
        })
        .catch(err => {
          setIsShowAddList(false);
          console.log(err);
        });
    }
  };

  const deleteList = (item, index) => {
    setIsDeleted({deleted: true, index: index});
    let id = item._id;
    fetch(`http://192.168.0.106:8080/delete-list/${id}`, {
      method: 'delete',
    })
      .then(res => {
        ToastAndroid.showWithGravityAndOffset(
          'Deleted Successfully...',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
        setIsDeleted({deleted: false, index: index});
      })
      .catch(err => {
        setIsDeleted({deleted: false, index: index});
        console.log('err', err);
      });
  };

  const getLists = async () => {
    let user = await AsyncStorage.getItem('id');
    let id = JSON.parse(user).id;
    fetch(`http://192.168.0.106:8080/get-list/${id}`)
      .then(res => {
        res
          .json()
          .then(data => {
            if (res?.status === 200) {
              setListsData(data);
            }
          })
          .catch(err => {
            console.log('err', err);
          });
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const update = item => {
    setIsUpdatVal({show: true, data: item});
    setVal(item.title);
  };

  const cancelUpdate = () => {
    setIsUpdatVal({show: false});
    setVal('');
  };

  const updateList = () => {
    let id = isUpdatVal.data._id;
    let value = true;
    setIsShowAddList(true);
    fetch(`http://192.168.0.106:8080/update-list/${id}`, {
      method: 'put',
      body: JSON.stringify({title: val, edited: value}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        setIsShowAddList(false);
        setVal('');
        setIsUpdatVal({show: false});
        ToastAndroid.showWithGravityAndOffset(
          'update Successfully...',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      })
      .catch(err => {
        console.log('err', err);
        setIsShowAddList(false);
      });
  };

  const userLogOut = async () => {
    try {
      setIsUserLogOut(true);
      props.navigation.navigate('login');
      await AsyncStorage.removeItem('id');
      ToastAndroid.showWithGravityAndOffset(
        'logOut Successfully...',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      setIsUserLogOut(false);
    } catch (error) {
      console.log(error, 'err');
      setIsUserLogOut(true);
    }
  };

  useEffect(() => {
    getLists();
  }, [addList, deleteList, props]);

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>mern stack todo</Text>
        <TouchableOpacity
          style={[styles.pressable, {width: '25%'}]}
          onPress={() => userLogOut()}>
          {isUserLogOut ? (
            <ActivityIndicator />
          ) : (
            <Text style={{color: '#b3b3b3', fontSize: 20}}>Log Out</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.direction}>
        <TextInput
          placeholder="Enter a value"
          style={[styles.textInput, {width: isUpdatVal.show ? '50%' : '65%'}]}
          value={val}
          onChangeText={text => setVal(text)}
        />
        {isUpdatVal.show && (
          <TouchableOpacity
            onPress={() => cancelUpdate()}
            style={[styles.pressable]}>
            <Text style={{color: '#b3b3b3', fontSize: 20}}>Cancel</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            isUpdatVal?.show ? updateList() : addList();
          }}
          style={styles.pressable}>
          {isShowAddList ? (
            <ActivityIndicator />
          ) : (
            <Text style={{color: '#b3b3b3', fontSize: 20}}>
              {isUpdatVal?.show ? 'Update' : 'Add'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {listsData.length === 0 ? (
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              textAlignVertical: 'center',
            }}>
            No data found
          </Text>
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={listsData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>
                  {index + 1} - {item.title}{' '}
                  {item.edited === false ? null : '(Edited)'}
                </Text>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity onPress={() => update(item)}>
                    <EditIcon
                      name="edit"
                      size={20}
                      color="#b3b3b3"
                      style={{padding: 10}}
                    />
                  </TouchableOpacity>
                  {isDeleted.deleted && isDeleted.index === index ? (
                    <ActivityIndicator style={{padding: 10}} />
                  ) : (
                    <TouchableOpacity onPress={() => deleteList(item, index)}>
                      <DeleteIcon
                        name="delete"
                        size={20}
                        color="#F22"
                        style={{padding: 10}}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Home;
