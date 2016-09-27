/*
 * Cipher.js
 * A block-cipher algorithm implementation on JavaScript
 * See Cipher.readme.txt for further information.
 *
 * Copyright(c) 2009 Atsushi Oka [ http://oka.nu/ ]
 * This script file is distributed under the LGPL
 *
 * ACKNOWLEDGMENT
 *
 *     The main subroutines are written by Michiel van Everdingen.
 *
 *     Michiel van Everdingen
 *     http://home.versatel.nl/MAvanEverdingen/index.html
 *
 *     All rights for these routines are reserved to Michiel van Everdingen.
 *
 */

function initBlockCipher( packageRoot ) {
    __unit( "Cipher.js" );
    __uses( "packages.js" );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Math
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var MAXINT = 0xFFFFFFFF;

function rotb(b,n){ return ( b<<n | b>>>( 8-n) ) & 0xFF; }
function rotw(w,n){ return ( w<<n | w>>>(32-n) ) & MAXINT; }
function getW(a,i){ return a[i]|a[i+1]<<8|a[i+2]<<16|a[i+3]<<24; }
function setW(a,i,w){ a.splice(i,4,w&0xFF,(w>>>8)&0xFF,(w>>>16)&0xFF,(w>>>24)&0xFF); }
function setWInv(a,i,w){ a.splice(i,4,(w>>>24)&0xFF,(w>>>16)&0xFF,(w>>>8)&0xFF,w&0xFF); }
function getB(x,n){ return (x>>>(n*8))&0xFF; }

function getNrBits(i){ var n=0; while (i>0){ n++; i>>>=1; } return n; }
function getMask(n){ return (1<<n)-1; }

// added 2008/11/13 XXX MUST USE ONE-WAY HASH FUNCTION FOR SECURITY REASON
function randByte() {
    return Math.floor( Math.random() * 256 );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ciphers
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var ALGORITHMS = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createRijndael() {
    //
	var keyBytes      = null;
	var dataBytes     = null;
	var dataOffset    = -1;
	// var dataLength    = -1;
	var algorithmName = null;
	//var idx2          = -1;
    //

    algorithmName = "rijndael"

    var aesNk;
    var aesNr;

    var aesPows;
    var aesLogs;
    var aesSBox;
    var aesSBoxInv;
    var aesRco;
    var aesFtable;
    var aesRtable;
    var aesFi;
    var aesRi;
    var aesFkey;
    var aesRkey;

    function aesMult(x, y){ return (x&&y) ? aesPows[(aesLogs[x]+aesLogs[y])%255]:0; }

    function aesPackBlock() {
      return [ getW(dataBytes,dataOffset), getW(dataBytes,dataOffset+4), getW(dataBytes,dataOffset+8), getW(dataBytes,dataOffset+12) ];
    }

    function aesUnpackBlock(packed){
      for ( var j=0; j<4; j++,dataOffset+=4) setW( dataBytes, dataOffset, packed[j] );
    }

    function aesXTime(p){
      p <<= 1;
      return p&0x100 ? p^0x11B : p;
    }

    function aesSubByte(w){
      return aesSBox[getB(w,0)] | aesSBox[getB(w,1)]<<8 | aesSBox[getB(w,2)]<<16 | aesSBox[getB(w,3)]<<24;
    }

    function aesProduct(w1,w2){
      return aesMult(getB(w1,0),getB(w2,0)) ^ aesMult(getB(w1,1),getB(w2,1))
	   ^ aesMult(getB(w1,2),getB(w2,2)) ^ aesMult(getB(w1,3),getB(w2,3));
    }

    function aesInvMixCol(x){
      return aesProduct(0x090d0b0e,x)     | aesProduct(0x0d0b0e09,x)<<8 |
	     aesProduct(0x0b0e090d,x)<<16 | aesProduct(0x0e090d0b,x)<<24;
    }

    function aesByteSub(x){
      var y=aesPows[255-aesLogs[x]];
      x=y;  x=rotb(x,1);
      y^=x; x=rotb(x,1);
      y^=x; x=rotb(x,1);
      y^=x; x=rotb(x,1);
      return x^y^0x63;
    }

    function aesGenTables(){
      var i,y;
      aesPows = [ 1,3 ];
      aesLogs = [ 0,0,null,1 ];
      aesSBox = new Array(256);
      aesSBoxInv = new Array(256);
      aesFtable = new Array(256);
      aesRtable = new Array(256);
      aesRco = new Array(30);

      for ( i=2; i<256; i++){
	aesPows[i]=aesPows[i-1]^aesXTime( aesPows[i-1] );
	aesLogs[aesPows[i]]=i;
      }

      aesSBox[0]=0x63;
      aesSBoxInv[0x63]=0;
      for ( i=1; i<256; i++){
	y=aesByteSub(i);
	aesSBox[i]=y; aesSBoxInv[y]=i;
      }

      for (i=0,y=1; i<30; i++){ aesRco[i]=y; y=aesXTime(y); }

      for ( i=0; i<256; i++){
	y = aesSBox[i];
	aesFtable[i] = aesXTime(y) | y<<8 | y<<16 | (y^aesXTime(y))<<24;
	y = aesSBoxInv[i];
	aesRtable[i]= aesMult(14,y) | aesMult(9,y)<<8 |
		      aesMult(13,y)<<16 | aesMult(11,y)<<24;
      }
    }

    function aesInit( key ){
      keyBytes = key;
      keyBytes=keyBytes.slice(0,32);
      var i,k,m;
      var j = 0;
      var l = keyBytes.length;

      while ( l!=16 && l!=24 && l!=32 ) keyBytes[l++]=keyBytes[j++];
      aesGenTables();

      aesNk = keyBytes.length >>> 2;
      aesNr = 6 + aesNk;

      var N=4*(aesNr+1);

      aesFi = new Array(12);
      aesRi = new Array(12);
      aesFkey = new Array(N);
      aesRkey = new Array(N);

      for (m=j=0;j<4;j++,m+=3){
	aesFi[m]=(j+1)%4;
	aesFi[m+1]=(j+2)%4;
	aesFi[m+2]=(j+3)%4;
	aesRi[m]=(4+j-1)%4;
	aesRi[m+1]=(4+j-2)%4;
	aesRi[m+2]=(4+j-3)%4;
      }

      for (i=j=0;i<aesNk;i++,j+=4) aesFkey[i]=getW(keyBytes,j);

      for (k=0,j=aesNk;j<N;j+=aesNk,k++){
	aesFkey[j]=aesFkey[j-aesNk]^aesSubByte(rotw(aesFkey[j-1], 24))^aesRco[k];
	if (aesNk<=6)
	  for (i=1;i<aesNk && (i+j)<N;i++) aesFkey[i+j]=aesFkey[i+j-aesNk]^aesFkey[i+j-1];
	else{
	  for (i=1;i<4 &&(i+j)<N;i++) aesFkey[i+j]=aesFkey[i+j-aesNk]^aesFkey[i+j-1];
	  if ((j+4)<N) aesFkey[j+4]=aesFkey[j+4-aesNk]^aesSubByte(aesFkey[j+3]);
	  for (i=5;i<aesNk && (i+j)<N;i++) aesFkey[i+j]=aesFkey[i+j-aesNk]^aesFkey[i+j-1];
	}
      }

      for (j=0;j<4;j++) aesRkey[j+N-4]=aesFkey[j];
      for (i=4;i<N-4;i+=4){
	k=N-4-i;
	for (j=0;j<4;j++) aesRkey[k+j]=aesInvMixCol(aesFkey[i+j]);
      }
      for (j=N-4;j<N;j++) aesRkey[j-N+4]=aesFkey[j];
    }

    function aesClose(){
      aesPows=aesLogs=aesSBox=aesSBoxInv=aesRco=null;
      aesFtable=aesRtable=aesFi=aesRi=aesFkey=aesRkey=null;
    }

    function aesRounds( block, key, table, inc, box ){
      var tmp = new Array( 4 );
      var i,j,m,r;

      for ( r=0; r<4; r++ ) block[r]^=key[r];
      for ( i=1; i<aesNr; i++ ){
	for (j=m=0;j<4;j++,m+=3){
	  tmp[j]=key[r++]^table[block[j]&0xFF]^
		 rotw(table[(block[inc[m]]>>>8)&0xFF], 8)^
		 rotw(table[(block[inc[m+1]]>>>16)&0xFF], 16)^
		 rotw(table[(block[inc[m+2]]>>>24)&0xFF], 24);
	}
	var t=block; block=tmp; tmp=t;
      }

      for (j=m=0;j<4;j++,m+=3)
	tmp[j]=key[r++]^box[block[j]&0xFF]^
	       rotw(box[(block[inc[m  ]]>>> 8)&0xFF], 8)^
	       rotw(box[(block[inc[m+1]]>>>16)&0xFF],16)^
	       rotw(box[(block[inc[m+2]]>>>24)&0xFF],24);
      return tmp;
    }

    function aesEncrypt( data,offset ){
      dataBytes = data;
      dataOffset = offset;
      aesUnpackBlock( aesRounds( aesPackBlock(), aesFkey, aesFtable, aesFi, aesSBox ) );
    }

    function aesDecrypt( data,offset){
      dataBytes = data;
      dataOffset = offset;
      aesUnpackBlock( aesRounds(aesPackBlock(), aesRkey, aesRtable, aesRi, aesSBoxInv ) );
    }

    return {
	name    : "rijndael",
	blocksize : 128/8,
	open    : aesInit,
	close   : aesClose,
	encrypt : aesEncrypt,
	decrypt : aesDecrypt
    };
}
ALGORITHMS.RIJNDAEL = {
    create : createRijndael
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BLOCK CIPHER MODES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var MODES = {};

function createECB() {
    function encryptOpenECB() {
	this.algorithm.open( this.keyBytes );
	this.dataLength = this.dataBytes.length;
	this.dataOffset=0;
	// idx2=0;
	return;
    }

    function encryptCloseECB() {
	this.algorithm.close();
    }
    function encryptProcECB(){
	this.algorithm.encrypt( this.dataBytes, this.dataOffset );
	this.dataOffset += this.algorithm.blocksize;
	if (this.dataLength<=this.dataOffset) {
	    return 0;
	} else {
	    return this.dataLength-this.dataOffset;
	}
    }
    function decryptOpenECB() {
	this.algorithm.open( this.keyBytes );
	// this.dataLength = dataBytes.length;
	this.dataLength = this.dataBytes.length;
	this.dataOffset=0;
	// idx2=0;
	return;
    }

    function decryptProcECB(){
	this.algorithm.decrypt( this.dataBytes, this.dataOffset );
	this.dataOffset += this.algorithm.blocksize;
	if ( this.dataLength<=this.dataOffset ){
	    return 0;
	} else {
	    return this.dataLength-this.dataOffset;
	}
    }
    function decryptCloseECB() {
	this.algorithm.close();

	// ???
	while( this.dataBytes[this.dataBytes.length-1] ==0 )
	    this.dataBytes.pop();
	// while( dataBytes[dataBytes.length-1] ==0 )
	//     dataBytes.pop();
    }

    return {
	encrypt : {
	    open  : encryptOpenECB,
	    exec  : encryptProcECB,
	    close : encryptCloseECB
	},
	decrypt : {
	    open  : decryptOpenECB,
	    exec  : decryptProcECB,
	    close : decryptCloseECB
	}
    };
}
MODES.ECB = createECB();


function createCBC() {
    function encryptOpenCBC() {
	this.algorithm.open( this.keyBytes );
	this.dataBytes.unshift(
	    randByte(),randByte(),randByte(),randByte(),   randByte(),randByte(),randByte(),randByte(),
	    randByte(),randByte(),randByte(),randByte(),   randByte(),randByte(),randByte(),randByte()
	);
	this.dataLength = this.dataBytes.length;
	this.dataOffset=16;
	// idx2=0;
	return;
    }
    function encryptProcCBC(){
	for (var idx2=this.dataOffset; idx2<this.dataOffset+16; idx2++)
	    this.dataBytes[idx2] ^= this.dataBytes[idx2-16];
	this.algorithm.encrypt( this.dataBytes, this.dataOffset );
	this.dataOffset += this.algorithm.blocksize;

	if (this.dataLength<=this.dataOffset) {
	    return 0;
	} else {
	    return this.dataLength-this.dataOffset;
	}
    }
    function encryptCloseCBC() {
	this.algorithm.close();
    }

    function decryptOpenCBC() {
	this.algorithm.open( this.keyBytes );
	this.dataLength = this.dataBytes.length;

	// notice it start from dataOffset:16
	this.dataOffset=16;

	// added 2008/12/31
	// 1. Create a new field for initialization vector.
	// 2. Get initialized vector and store it on the new field.
	this.iv = this.dataBytes.slice(0,16);

	// idx2=0;
	return;
    }

    // function decryptProcCBC(){
    //     this.dataOffset=this.dataLength-this.dataOffset;
    //
    //     this.algorithm.decrypt( this.dataBytes, this.dataOffset );
    //     this.dataOffset += this.algorithm.blocksize;
    //
    //     for (var idx2=this.dataOffset-16; idx2<this.dataOffset; idx2++)
    //         this.dataBytes[idx2] ^= this.dataBytes[idx2-16];
    //
    //     this.dataOffset = this.dataLength+32-this.dataOffset;
    //
    //     if ( this.dataLength<=this.dataOffset ){
    //         return 0;
    //     } else {
    //         return this.dataLength-this.dataOffset;
    //     }
    // }

    function decryptProcCBC(){
	// copy cipher text for later use of initialization vector.
	var iv2 = this.dataBytes.slice( this.dataOffset, this.dataOffset + 16 );
	// decryption
	this.algorithm.decrypt( this.dataBytes, this.dataOffset );
	// xor with the current initialization vector.
	for ( var ii=0; ii<16; ii++ )
	    this.dataBytes[this.dataOffset+ii] ^= this.iv[ii];

	// advance the index counter.
	this.dataOffset += this.algorithm.blocksize;
	// set the copied previous cipher text as the current initialization vector.
	this.iv = iv2;

	if ( this.dataLength<=this.dataOffset ){
	    return 0;
	} else {
	    return this.dataLength-this.dataOffset;
	}
    }
    function decryptCloseCBC() {
	this.algorithm.close();
	// trace( "splice.before:"+base16( this.dataBytes ) );
	this.dataBytes.splice(0,16);
	// trace( "splice.after:"+base16( this.dataBytes ) );

	// ???
	while( this.dataBytes[this.dataBytes.length-1] ==0 )
	    this.dataBytes.pop();
    }

    return {
	encrypt : {
	    open  : encryptOpenCBC,
	    exec  : encryptProcCBC,
	    close : encryptCloseCBC
	},
	decrypt : {
	    open  : decryptOpenCBC,
	    exec  : decryptProcCBC,
	    close : decryptCloseCBC
	}
    };
}
MODES.CBC = createCBC();

function createCFB() {
    function encryptOpenCFB() {
	throw "not implemented!";
    }
    function encryptProcCFB(){
	throw "not implemented!";
    }
    function encryptCloseCFB() {
	throw "not implemented!";
    }
    function decryptOpenCFB() {
	throw "not implemented!";
    }
    function decryptProcCFB(){
	throw "not implemented!";
    }
    function decryptCloseCFB() {
	throw "not implemented!";
    }

    return {
	encrypt : {
	    open  : encryptOpenCFB,
	    exec  : encryptProcCFB,
	    close : encryptCloseCFB
	},
	decrypt : {
	    open  : decryptOpenCFB,
	    exec  : decryptProcCFB,
	    close : decryptCloseCFB
	}
    };
}
MODES.CFB = createCFB();

function createOFB(){
    function encryptOpenOFB() {
	throw "not implemented!";
    }
    function encryptProcOFB(){
	throw "not implemented!";
    }
    function encryptCloseOFB() {
	throw "not implemented!";
    }
    function decryptOpenOFB() {
	throw "not implemented!";
    }
    function decryptProcOFB(){
	throw "not implemented!";
    }
    function decryptCloseOFB() {
	throw "not implemented!";
    }

    return {
	encrypt : {
	    open  : encryptOpenOFB,
	    exec  : encryptProcOFB,
	    close : encryptCloseOFB
	},
	decrypt : {
	    open  : decryptOpenOFB,
	    exec  : decryptProcOFB,
	    close : decryptCloseOFB
	}
    };
}
MODES.OFB = createOFB();

function createCTR() {
    function encryptOpenCTR() {
	throw "not implemented!";
    }
    function encryptProcCTR(){
	throw "not implemented!";
    }
    function encryptCloseCTR() {
	throw "not implemented!";
    }
    function decryptOpenCTR() {
	throw "not implemented!";
    }
    function decryptProcCTR(){
	throw "not implemented!";
    }
    function decryptCloseCTR() {
	throw "not implemented!";
    }

    return {
	encrypt : {
	    open  : encryptOpenCTR,
	    exec  : encryptProcCTR,
	    close : encryptCloseCTR
	},
	decrypt : {
	    open  : decryptOpenCTR,
	    exec  : decryptProcCTR,
	    close : decryptCloseCTR
	}
    };
}
MODES.CTR = createCTR();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PADDING ALGORITHMS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var PADDINGS = {};

function createPKCS7() {
    function appendPaddingPKCS7(data) {
	// trace( "appendPaddingPKCS7");
	// alert( "appendPaddingPKCS7");
	var len = 16 - ( data.length % 16 );
	for ( var i=0; i<len; i++ ) {
	    data.push( len );
	}
	// trace( "data:"+base16(data) );
	// trace( "data.length:"+data.length );
	return data;
    }
    // trace( "appendPaddingPKCS7:" + base16( appendPaddingPKCS7( [0,1,2,3,4,5,6,7,8,9 ] ) ) );
    function removePaddingPKCS7(data) {
	var len = data.pop();
	if ( 16 < len ) len = 0;
	for ( var i=1; i<len; i++ ) {
	    data.pop();
	}
	return data;
    }
    // trace( "removePaddingPKCS7:" + base16( removePaddingPKCS7( [0,1,2,3,4,5,6,7,8,9,0x00,04,04,04,0x04] ) ) );
    return {
	append : appendPaddingPKCS7,
	remove : removePaddingPKCS7
    };
}
PADDINGS.PKCS7 = createPKCS7();

/*
 * NO PADDINGS
 */
function createNoPadding() {
    function appendPaddingNone(data) {
	return data;
    }
    // trace( "appendPaddingPKCS7:" + base16( appendPaddingPKCS7( [0,1,2,3,4,5,6,7,8,9 ] ) ) );
    function removePaddingNone(data) {
	return data;
    }
    // trace( "removePaddingPKCS7:" + base16( removePaddingPKCS7( [0,1,2,3,4,5,6,7,8,9,0x00,04,04,04,0x04] ) ) );
    return {
	append : appendPaddingNone,
	remove : removePaddingNone
    };
}
PADDINGS.NO_PADDING = createNoPadding();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ENCRYPT/DECRYPT
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var DIRECTIONS = {
    ENCRYPT : "encrypt",
    DECRYPT : "decrypt"
};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// INTERFACE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Cipher( algorithm, direction, mode, padding ) {
    this.algorithm = algorithm;
    this.direction = direction;
    this.mode = mode;
    this.padding = padding;

    this.modeOpen  = mode[ direction ].open;
    this.modeExec  = mode[ direction ].exec;
    this.modeClose = mode[ direction ].close;

    // NOTE : values below are reffered by MODE functions via "this" parameter.
    this.keyBytes  = null;
    this.dataBytes = null;
    this.dataOffset = -1;
    this.dataLength = -1;

}

Cipher.prototype = new Object();
Cipher.prototype.inherit = Cipher;

function open( keyBytes, dataBytes ) {
    if ( keyBytes == null ) throw "keyBytes is null";
    if ( dataBytes == null ) throw "dataBytes is null";

    // BE CAREFUL : THE KEY GENERATING ALGORITHM OF SERPENT HAS SIDE-EFFECT
    // TO MODIFY THE KEY ARRAY.  IT IS NECESSARY TO DUPLICATE IT BEFORE
    // PROCESS THE CIPHER TEXT.
    this.keyBytes = keyBytes.concat();

    // DATA BUFFER IS USUALLY LARGE. DON'T DUPLICATE IT FOR PERFORMANCE REASON.
    this.dataBytes = dataBytes/*.concat()*/;

    this.dataOffset = 0;
    this.dataLength = dataBytes.length;

    //if ( this.direction == Cipher.ENCRYPT ) // fixed 2008/12/31
    if ( this.direction == DIRECTIONS.ENCRYPT ) {
	this.padding.append( this.dataBytes );
    }

    this.modeOpen();
}

function operate() {
    return this.modeExec();
}

function close() {
    this.modeClose();
    // if ( this.direction == Cipher.DECRYPT ) // fixed 2008/12/31
    if ( this.direction == DIRECTIONS.DECRYPT ) {
	this.padding.remove( this.dataBytes );
    }
    return this.dataBytes;
}

function execute( keyBytes, dataBytes ) {
    this.open( keyBytes, dataBytes );
    for(;;) {
	var size = this.operate();
	if ( 0<size ) {
	    // trace( size );
	    //alert( size );
	    continue;
	} else {
	    break;
	}
    }
    return this.close();
}

Cipher.prototype.open = open;
Cipher.prototype.close = close;
Cipher.prototype.operate = operate;
Cipher.prototype.execute = execute;

////////////////////////////////////////////////////////////////////////

// this.updateMode = function() {
//     this.modeProcs = this.mode[ this.direction ];
// };


////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


Cipher.ENCRYPT  = "ENCRYPT";
Cipher.DECRYPT  = "DECRYPT";

Cipher.RIJNDAEL = "RIJNDAEL";
Cipher.SERPENT  = "SERPENT";
Cipher.TWOFISH  = "TWOFISH";

Cipher.ECB      = "ECB";
Cipher.CBC      = "CBC";
Cipher.CFB      = "CFB";
Cipher.OFB      = "OFB";
Cipher.CTR      = "CTR";

Cipher.RFC1321    = "RFC1321";
Cipher.ANSIX923   = "ANSIX923";
Cipher.ISO10126   = "ISO10126";
Cipher.PKCS7      = "PKCS7";
Cipher.NO_PADDING = "NO_PADDING";

Cipher.create = function( algorithmName, directionName, modeName, paddingName ) {

    if ( algorithmName == null ) algorithmName = Cipher.RIJNDAEL;
    if ( directionName == null ) directionName = Cipher.ENCRYPT;
    if ( modeName      == null ) modeName      = Cipher.CBC;
    if ( paddingName   == null ) paddingName   = Cipher.PKCS7;

    var algorithm  = ALGORITHMS[ algorithmName ];
    var direction  = DIRECTIONS[ directionName ];
    var mode       = MODES[ modeName ];
    var padding    = PADDINGS[ paddingName ];

    if ( algorithm  == null ) throw "Invalid algorithm name '" + algorithmName + "'.";
    if ( direction  == null ) throw "Invalid direction name '" + directionName + "'.";
    if ( mode       == null ) throw "Invalid mode name '"      + modeName      + "'.";
    if ( padding    == null ) throw "Invalid padding name '"   + paddingName   + "'.";

    return new Cipher( algorithm.create(), direction, mode, padding );
};

Cipher.algorithm = function( algorithmName ) {
    if ( algorithmName == null ) throw "Null Pointer Exception ( algorithmName )";
    var algorithm  = ALGORITHMS[ algorithmName ];
    if ( algorithm  == null ) throw "Invalid algorithm name '" + algorithmName + "'.";
    // trace( "ss" );
    // trace( algorithm );
    return algorithm.create();
}


///////////////////////////////////
// export
///////////////////////////////////
__export( packageRoot, "Cipher", Cipher );

} // the end of initBlockCipher();


initBlockCipher( this );


// vim:ts=8 sw=4:noexpandtab:
