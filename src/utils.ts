
export let dealString = {
  strToArr: function (str: string, in1=',', in2=':') {
    let arr = []
    arr = str.split(in1)
    for (let i=0; i<arr.length; i++) {
      arr[i] = arr[i].split(in2)
      for (let j=0; j<arr[i].length; j++) {
        arr[i][j] = this.trim(arr[i][j])
      }
    }
    arr = arr.filter((item, index, arr) => {
      return item.length > 1
    })
    return arr
  },
  strToJson: function (str, in1=',', in2=':') {
    let arr = this.strToArr(str, in1, in2)
    let obj = {}
    for (let i=0; i<arr.length; i++) {
      if (arr[i] && arr[i][0]) {
        obj[arr[i][0]] = arr[i][1]
      }
    }
    return obj
  },
  trim: function (value) {
    value = value ? value.replace(/(^\s*)|(\s*$)/g, "") : ''
    return value
  }
}