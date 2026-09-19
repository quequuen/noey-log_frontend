const LOGO_VARIANTS = [
    '/cool_ver.png',
    '/cute_ver.png',
    '/normal_ver.png',
    '/smile_ver.png',
    '/tongue_ver.png',
    '/twinkle_ver.png',
    '/winq_ver.png',
];

// 로컬 날짜가 바뀔 때마다(자정 기준) 다음 버전으로 순환한다.
function getTodaysLogo(): string {
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return LOGO_VARIANTS[dateSeed % LOGO_VARIANTS.length];
}

const Header = () => {
    return (
        <>
            <div className="w-full flex flex-col items-center justify-center">
                <img className="h-24 sm:h-32 md:h-35 w-auto object-contain" src={getTodaysLogo()} alt="logo" />
            </div>
        </>
    )

}

export default Header;
