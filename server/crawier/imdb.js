
// import _ from 'lodash'
import R from 'ramda'
import rp from 'request-promise'
import cheerio from 'cheerio'
import {writeFileSync, writeFile} from 'fs'
//import Agent from'socks5-http-client/lib/Agent'


export const getIMDBCharaters = async () => {
    const options = {
        uri:'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
        // agentClass: Agent,
        // agentOptions: {
        //   socksHost: 'localhost',
        //   socksPort: 1080 // 本地 VPN 的端口，这里用的 shadowsocks
        // },
        transform:body => cheerio.load(body)
        
    }
    
    const $ = await rp(options)
    let photos = []
    console.log($('table.cast_list tr.odd, tr.even').length)
    $('table.cast_list tr.odd, tr.even').each(function(){
        const nmIdDom = $(this).find('td.itemprop a')
        const nmId = nmIdDom.attr('href')

        let characterDom = $(this).find('td.character a')
        let name = characterDom.text()
        let chId = characterDom.attr('href')
        const palyedByDom = $(this).find('td.itemprop span.itemprop')
        const palyedBy = $(this).text()
        
        photos.push({
            nmId,
            chId,
            name,
            palyedBy
        })
    })
    console.log("共拿到"+photos.length+'条数据')
    console.log("photos的第一个数据",photos[0])
    let newarr= []
    photos.forEach(function(photo,index){
        console.log("photo:",photo)
        
        if(photo.playedBy && photo.name && photo.nmId && photo.chId){
            //const reg1 = /\/name\/(.*)\/\?ref/
            const reg1 = new RegExp(/\/name\/(.*)\/\?ref/)
            //const reg2 = /\/characters\/(.*)\/\?ref/
            const reg2 = new RegExp(/\/characters\/(.*)\/\?ref/)
            
            const match1 = photo.nmId.match(reg1)
            console.log("match1:",match1)
            const match2 = photo.chId.match(reg2)
            console.log("match2:",match2)
            nmId = match1[1]
            chId = match2[1]

            newarr.push({
                nmId,
                chId
            })
        }
    })


    // const fn = R.compose(
    //     R.map(photo => {
    //       const reg1 = /\/name\/(.*?)\/\?ref/
    //       const reg2 = /\/character\/(.*?)\/\?ref/
    
    //       const match1 = photo.nmId.match(reg1)
    //       console.log("match1:",match1)
    //       const match2 = photo.chId.match(reg2)
    //       console.log("match2:",match2)
    //       photo.nmId = match1[1]
    //       photo.chId = match2[1]
          
    //       return photo
    //     }),
    //     R.filter(photo => photo.playedBy && photo.name && photo.nmId && photo.chId)
    // )
    // photos=fn(photos)
    console.log("清洗后,剩余"+newarr.length+'条数据')
    
    writeFileSync('./imdb.JSON',JSON.stringify(photos,null,2),'utf8')

}


getIMDBCharaters()
