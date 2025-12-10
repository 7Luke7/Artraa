const SuccessAlert = ({message}) => {
    return <div class="bg-white fixed bottom-10 -translate-x-1/2 right-1/2 left-1/2 shadow-[0_3px_10px_-3px_rgba(6,81,237,0.3)] border-l-[6px] border-green-600 text-slate-900 flex items-center w-full min-w-xs max-w-lg p-4 rounded-md"
        role="alert">
        <div class="mr-3 shrink-0">
          <img src='/svg/check.svg' width={20} height={20} />
        </div>
        <span class="text-[15px] font-medium-tbc text-gray-800 tracking-wide">{message}</span>
      </div>
}
export default SuccessAlert