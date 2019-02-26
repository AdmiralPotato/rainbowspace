import store from './store'

export default (names) => {
  let result = {}
  names.forEach((name) => {
    result[name] = {
      get () {
        return store.state[name]
      },
      set (value) {
        store.dispatch(
          'changeSettings',
          { [name]: value }
        )
      }
    }
  })
  return result
}
