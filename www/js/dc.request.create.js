class ClashMatrixView {


  constructor() {
    this._matrixView = {}
    this._matrixView.cols = ['Left Document  &  Right Document', 'Counts of Clashed Objects in Left Document']
    this._matrixView.rows = []
  }

  async produceClashMatrixTable(mc_containter_id, ms_id, ms_v_id) {

    try {
      this._matrixView.rows = []

      const res = await this.getMatrixData(mc_containter_id, ms_id, ms_v_id)
      const matrixView = res.matrixView
      //const ignoredAssinedClash = res.ignoredAssinedClash
       for (let index in matrixView) {
        const leftDocName = matrixView[index].leftDocName
        const rightDocName = matrixView[index].rightDocName
        const leftClashObjectCount = matrixView[index].leftClashObjectCount
        const rightClachObjectCount = matrixView[index].rightClachObjectCount
 
        this._matrixView.rows.push([leftDocName + '  &  ' + rightDocName, leftClashObjectCount])
        this._matrixView.rows.push([rightDocName + '  &  ' + leftDocName, rightClachObjectCount])
      }

      global_Utility.successMessage('produceClashMatrixTable succceeded!')  
      return true

    } catch (e) {
      console.log('produceClashMatrixTable failed!')
      global_Utility.failMessage('produceClashMatrixTable Failed!')  

      return false

    }
  }

  getMatrixData(mc_containter_id, ms_id, ms_v_id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/mc/clash/getMatrixData/' + mc_containter_id + '/' + ms_id + '/' + ms_v_id,
        type: 'GET',
        success: function (data) {
          resolve(data)
        }, error: function (error) {
          reject(error)
        }
      });
    })
  }

}
