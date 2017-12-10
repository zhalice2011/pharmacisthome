

const photo={ nmId: '/name/nm7711377/?ref_=ttfc_fc_cl_t728',
chId: '/title/tt0944947/characters/nm7711377?ref_=ttfc_fc_cl_t728',
name: 'Lannister Spearman1 episode, 2017\n                            ',
palyedBy: '\n          \n          \n          \n Noah Syndergaard\n          \n          \n              ...\n          \n          \n              \n         Lannister Spearman\n  \n  \n  (uncredited)\n  \n                      1 episode, 2017\n                            \n\n              \n          \n      ' 
}


var reg = new RegExp(/\/name\/(.*)\/\?ref/);

var reg2 = new RegExp(/\/characters\/(.*)\/\?ref/);

const match1 = photo.nmId.match(reg)
const match2 = photo.chId.match(reg2)

console.log("match1:",match1)
console.log("match1:",match1[1])
console.log("match2:",match2)
console.log("match2:",match2[1])
