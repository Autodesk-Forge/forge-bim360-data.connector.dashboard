class ClashBreakdownView {

    constructor() {
        this._breakdownData = null
    }

    async reset(){
        let breakdownTable = $('#breakdownTree').jstree(true)
        if(breakdownTable){
            $('#breakdownTree').jstree(true).settings.core.data = null;
            $('#breakdownTree').jstree(true).refresh();
        } 
        this._breakdownData = null
    }
    async initBreakdownList(mc_containter_id,ms_id, ms_v_id) {

        try{   
            this.reset()
            this._breakdownData = await this.getBreakdownData(mc_containter_id,ms_id, ms_v_id) 
            this._docsMap = global_msSet._docsMap

            let models_list = $('#models_list')
            models_list.empty()
            $("#models_list").empty()
            for (let index in global_msSet._docsMap) { 
                const oneItem = document.createElement('a')
                oneItem.classList.add('dropdown-item')
                oneItem.href = "#";
                oneItem.innerHTML = this._docsMap[index].name
                models_list.append(oneItem); 
            }
            if (models_list.height() > 400)
                models_list.addClass('dropdown-height')
            else
                models_list.removeClass('dropdown-height') 

            global_Utility.successMessage('initBreakdownList succceeded!')  

            return true
       }catch(e){
            console.log('initBreakdownList Failed!! ' + e )  
            global_Utility.failMessage('initBreakdownList Failed!')  
     
            return false
      }
    }

    async produceBreakdownView(docName) {
 
       

        let filter = this._docsMap.filter(function(data){
            return data.name == docName
        })
        const mainModelClashDocId = filter[0].clashDocId
        const breakview_thismodel = this._breakdownData[mainModelClashDocId]

        var data = []
        var Ldid = mainModelClashDocId
        for (var Lvid in breakview_thismodel) {
            
            var leftObjName = global_forgeViewer._clashDocToModel[Ldid].model.getInstanceTree().getNodeName(Lvid)
            //var leftObjName = <also feasible from Index Result of MC API>

            var first_level_data = {
                type:'leftobj',
                text: leftObjName,
                data: { level: 1 },
                children: [], state: { opened: false }
            }

            var first_level_index = data.push(first_level_data) - 1

            for (var Rdid in breakview_thismodel[Lvid]) {
                var RModelName = global_forgeViewer._clashDocToModel[Rdid].name

                var secodlevel_data = {
                    type:'model',
                    text: RModelName,
                    data: { level: 2, clashes: [] },
                    children: [], state: { opened: false }
                }

                var second_level_index = data[first_level_index].children.push(secodlevel_data) - 1

                for (let i in breakview_thismodel[Lvid][Rdid]) {

                    var Rvid = breakview_thismodel[Lvid][Rdid][i]  
                    var rightObjName = global_forgeViewer._clashDocToModel[Rdid].model.getInstanceTree().getNodeName(Rvid)
                    //var rightObjName = <also feasible from Index Result of MC API>

                    var thirdlevel_data = {
                        type:'rightobj',
                        text: rightObjName,
                        data: {level:3,clashes:[{ Ldid: parseInt(Ldid), 
                                                  Lvid: parseInt(Lvid), 
                                                  Rdid: parseInt(Rdid), 
                                                  Rvid: parseInt(Rvid)}]},
                        children: []
                    }

                    data[first_level_index].children[second_level_index].children.push(thirdlevel_data)
                    data[first_level_index].children[second_level_index].data["clashes"].push(
                        { Ldid: parseInt(Ldid), Lvid: parseInt(Lvid), Rdid: parseInt(Rdid), Rvid: parseInt(Rvid) })
                
                }
            }
        }

        let breakdownTable = $('#breakdownTree').jstree(true)
         
        if(breakdownTable){
            $('#breakdownTree').jstree(true).settings.core.data = data;
            $('#breakdownTree').jstree(true).refresh();
        }else{ 
            this.newJSTree(data)
        }//new jstree
    }
   

    getBreakdownData(mc_containter_id,ms_id, ms_v_id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/mc/clash/getBreakdownData/' +mc_containter_id +'/' + ms_id + '/' + ms_v_id,
                type: 'GET',
                success: function (data) {

                    const depressedData = new TextDecoder("utf-8").decode(pako.inflate(data)) 
                     resolve(JSON.parse(depressedData))
                }, error: function (error) {
                    reject(error)
                }
            });
        })
    }

    newJSTree(data){
        // load jstree
        $('#breakdownTree').jstree({
            plugins: ["table", "dnd", "contextmenu", "sort", "search",'types','checkbox'],
            search: {
                //case_sensitive: false,
                //show_only_matches: true
            },
            core: {
                data: data
            },
            checkbox : {
               keep_selected_style : false
            },
            // configure tree table
            table: {
                columns: [
                    { width: 600 }
                ],
                resizable: true,
                draggable: true,
                contextmenu: true, 
                width: 600,
                height: 490
            },
            types: {
                default: {
                  icon: 'jsicon fa fa-power-off'
                },
                leftobj: {
                  icon: 'jsicon fa fa-crosshairs'
                },
                rightobj: {
                  icon: 'jsicon fa fa-joomla'
                },
                model: {
                    icon: 'jsicon fa fa-codepen'
                  }
            }
        }).bind("activate_node.jstree", function (evt, data) {
    
            console.log(data)
            if (data.node) {
                let dataJson = data.node.data
    
                if (dataJson.level == 1) {
                    //do nothing
                }
                else {
                    //second / third level node., group clashes or single clash
                    global_forgeViewer.isolateClash(dataJson.clashes)
                }   
            } 
        });
 
    }
}


