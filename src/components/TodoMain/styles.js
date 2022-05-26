import {StyleSheet, StatusBar} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '94%',
    marginTop: StatusBar.currentHeight / 2,
  },
  heading: {
    fontSize: 22,
    textTransform: 'uppercase',
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  textInput: {
    height: 50,
    borderWidth: 0.5,
    marginTop: 15,
    alignSelf: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  pressable: {
    backgroundColor: '#fff',
    width: '20%',
    height: 50,
    borderWidth: 0.5,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  card: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 10,
    paddingTop: 10,
    elevation: 3,
  },
  itemContainer: {
    marginHorizontal: 14,
    marginVertical: 10,
    flexDirection: 'row',
  },
  iconsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 17,
    maxWidth: '60%',
    minWidth: '70%',
  },
});

export default styles;
