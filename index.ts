import { dlopen, suffix, FFIType, CString, ptr } from "bun:ffi";

const path = `index.${suffix}`;
const { pathname } = new URL(path, import.meta.url);

const { symbols } = dlopen(pathname, {
    Decode: {
        args: [FFIType.ptr],
        returns: FFIType.ptr,
    },
    FreeString: {
        args: [FFIType.ptr],
        returns: FFIType.void,
    },
});

// Encoder
const utf8e: TextEncoder = new TextEncoder();
const encode: (ptr: any) => Uint8Array = (ptr: any) => utf8e.encode(ptr + "\0");

const toString = function (ptr: any): string {
  const str = new CString(ptr);
  symbols.FreeString(str.ptr);
  return str.toString();
};

console.log(toString(symbols.Decode(ptr(encode("ip=3248789234&name=lucas"))))) 