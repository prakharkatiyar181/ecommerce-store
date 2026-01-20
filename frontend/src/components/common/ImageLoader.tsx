import { useState, useEffect, useRef, memo } from 'react'

interface ImageLoaderProps {
    src: string
    alt: string
    className?: string
}

// Lazy image loader with blur-up effect using IntersectionObserver
const ImageLoaderComponent = ({ src, alt, className = '' }: ImageLoaderProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const [hasError, setHasError] = useState(false)
    const imgRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!imgRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true)
                        observer.disconnect()
                    }
                })
            },
            { rootMargin: '50px' }
        )

        observer.observe(imgRef.current)

        return () => {
            observer.disconnect()
        }
    }, [])

    const handleLoad = () => {
        setIsLoaded(true)
    }

    const handleError = () => {
        setHasError(true)
    }

    return (
        <div
            ref={imgRef}
            className={className}
            style={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'var(--surface-light)'
            }}
        >
            {!hasError ? (
                <>
                    {isInView && (
                        <img
                            src={src}
                            alt={alt}
                            onLoad={handleLoad}
                            onError={handleError}
                            className={className}
                            style={{
                                opacity: isLoaded ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    )}
                    {!isLoaded && isInView && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                filter: 'blur(10px)',
                                transform: 'scale(1.1)'
                            }}
                        />
                    )}
                </>
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontSize: '0.9rem'
                    }}
                >
                    Image unavailable
                </div>
            )}
        </div>
    )
}

export const ImageLoader = memo(ImageLoaderComponent)
