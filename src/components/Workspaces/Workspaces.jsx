import { useEffect, useRef, useState } from "react"

const Workspaces = ({ allWorkspaces, runCommand }) => {
    const [workspaces, setWorkspaces] = useState()
    const [currentWorkspace, setCurrentWorkspace] = useState()
    const selectorRef = useRef(null)
    const [size, setSize] = useState()
    const [mainRes, setMainRes] = useState(allWorkspaces[0].width)

    useEffect(() => {
        if (selectorRef.current) {
            selectorRef.current.style
        }
    }, [selectorRef])

    useEffect(() => {
        const _currentWorkspaces = [...document.querySelectorAll(".workspace")]
        setWorkspaces(_currentWorkspaces)
        setCurrentWorkspace(allWorkspaces.findIndex((tab) => tab.hasFocus))
        setMainRes(allWorkspaces[0].width)
    }, [allWorkspaces])

    useEffect(() => {
        if (selectorRef.current && size?.width) {
            selectorRef.current.style.left = `${
                size.offset.left - size.width / 2 - 1
            }px`
            selectorRef.current.style.width = `${size.width}px`
        }
    }, [size, selectorRef])

    useEffect(() => {
        if (currentWorkspace >= 0) {
            setSize({
                width: workspaces[currentWorkspace].clientWidth,
                offset: workspaces[currentWorkspace].getBoundingClientRect(),
            })
        }
    }, [currentWorkspace])

    return (
        <div className="workspaces">
            <div className="workspace__selector" ref={selectorRef}></div>
            {allWorkspaces.sort((a,b) => a.name - b.name).map((workspace) => (
                <button
                    className={`workspace ${workspace.hasFocus && "focused"} ${
                        workspace.isDisplayed && "displayed"
                    } ${workspace.width !== mainRes && "workspace--secondary"}`}
                    onClick={() =>
                        runCommand(`focus --workspace ${workspace.name}`)
                    }
                    key={workspace.name}
                >
                    {workspace.displayName ?? workspace.name}
                </button>
            ))}
        </div>
    )
}

export default Workspaces
