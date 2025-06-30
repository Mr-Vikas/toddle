import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';

import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleItem from './ModuleItem';
import ModuleModal from './ModuleModal';
import Outline from './Outline';
import UploadModal from './UploadModal';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModuleId, setActiveModuleId] = useState(null);

  const moduleRefs = useRef({});
  const courseBuilderRef = useRef(null);

  // Memoize filteredModules and ungroupedItems
  const filteredModules = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return modules.filter(module => {
      const matchesName = module.name.toLowerCase().includes(query);
      const hasItemMatch = items.some(
        item =>
          item.moduleId === module.id &&
          (item.title.toLowerCase().includes(query) ||
            (item.fileName || '').toLowerCase().includes(query))
      );
      return matchesName || hasItemMatch;
    });
  }, [modules, items, searchQuery]);

  const ungroupedItems = useMemo(
    () => items.filter(item => item.moduleId === null),
    [items]
  );

  useEffect(() => {
    const container = courseBuilderRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollY = container.scrollTop + 100;
      const visible = Object.entries(moduleRefs.current).find(([id, el]) => {
        if (!el) return false;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        return scrollY >= top && scrollY <= bottom;
      });
      if (visible?.[0]) setActiveModuleId(visible[0]);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToModule = useCallback(id => {
    const el = moduleRefs.current[id];
    if (el && courseBuilderRef.current) {
      courseBuilderRef.current.scrollTo({
        top: el.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleSearch = useCallback(query => setSearchQuery(query), []);

  const handleAddClick = useCallback(type => {
    setCurrentModuleId(null);
    setItemToEdit(null);
    if (type === 'module') {
      setCurrentModule(null);
      setIsModuleModalOpen(true);
    } else if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'upload') {
      setIsUploadModalOpen(true);
    }
  }, []);

  const handleCloseModuleModal = useCallback(() => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  }, []);

  const handleCloseLinkModal = useCallback(() => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
    setItemToEdit(null);
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
    setItemToEdit(null);
  }, []);

  const handleSaveModule = useCallback(
    module => {
      setModules(prevModules =>
        currentModule
          ? prevModules.map(m => (m.id === module.id ? module : m))
          : [...prevModules, module]
      );
      setIsModuleModalOpen(false);
      setCurrentModule(null);
    },
    [currentModule]
  );

  const handleEditModule = useCallback(module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  }, []);

  const handleDeleteModule = useCallback(moduleId => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
    setItems(prev => prev.filter(item => item.moduleId !== moduleId));
  }, []);

  const handleAddItem = useCallback((moduleId, type) => {
    setCurrentModuleId(moduleId);
    setItemToEdit(null);
    if (type === 'link') setIsLinkModalOpen(true);
    else if (type === 'file') setIsUploadModalOpen(true);
  }, []);

  const handleEditItem = useCallback(item => {
    setCurrentModuleId(item.moduleId);
    setItemToEdit(item);
    if (item.type === 'link') setIsLinkModalOpen(true);
    else if (item.type === 'file') setIsUploadModalOpen(true);
  }, []);

  const handleSaveLink = useCallback(
    linkItem => {
      setItems(prev =>
        itemToEdit
          ? prev.map(i => (i.id === linkItem.id ? linkItem : i))
          : [...prev, linkItem]
      );
      handleCloseLinkModal();
    },
    [itemToEdit, handleCloseLinkModal]
  );

  const handleSaveUpload = useCallback(
    fileItem => {
      setItems(prev =>
        itemToEdit
          ? prev.map(i => (i.id === fileItem.id ? fileItem : i))
          : [...prev, fileItem]
      );
      handleCloseUploadModal();
    },
    [itemToEdit, handleCloseUploadModal]
  );

  const handleDeleteItem = useCallback(itemId => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const moveModule = useCallback((fromIndex, toIndex) => {
    setModules(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const moveItem = useCallback((draggedId, targetId, targetModuleId) => {
    setItems(prevItems => {
      const draggedItem = prevItems.find(item => item.id === draggedId);
      if (!draggedItem) return prevItems;

      let filteredItems = prevItems.filter(item => item.id !== draggedId);
      const updatedItem = { ...draggedItem, moduleId: targetModuleId };

      if (targetId) {
        const targetIndex = filteredItems.findIndex(
          item => item.id === targetId
        );
        if (targetIndex !== -1) {
          filteredItems.splice(targetIndex, 0, updatedItem);
        } else {
          filteredItems.push(updatedItem);
        }
      } else {
        const endOfModuleIndex = filteredItems.reduce(
          (lastIndex, item, idx) => {
            return item.moduleId === targetModuleId ? idx + 1 : lastIndex;
          },
          0
        );
        filteredItems.splice(endOfModuleIndex, 0, updatedItem);
      }
      return filteredItems;
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="course-builder-layout">
        <Header onAddClick={handleAddClick} onSearch={handleSearch} />

        <div
          className="course-builder"
          ref={courseBuilderRef}
          style={{
            overflowY: 'auto',
            paddingTop: '80px',
            height: 'calc(100vh - 0px)',
          }}
        >
          <div className="builder-content">
            {ungroupedItems.length > 0 && (
              <div className="ungrouped-section">
                <h3 className="ungrouped-heading">Ungrouped Resources</h3>
                <div className="module-items-list">
                  {ungroupedItems.map((item, index) => (
                    <ModuleItem
                      key={item.id}
                      item={item}
                      index={index}
                      moduleId={null}
                      onDelete={handleDeleteItem}
                      onEdit={handleEditItem}
                      moveItem={moveItem}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredModules.length === 0 && ungroupedItems.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="module-list">
                {filteredModules.map((module, index) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    index={index}
                    moveModule={moveModule}
                    moveItem={moveItem}
                    items={items}
                    onEdit={handleEditModule}
                    onDelete={handleDeleteModule}
                    onAddItem={handleAddItem}
                    onDeleteItem={handleDeleteItem}
                    onEditItem={handleEditItem}
                    moduleRef={el => (moduleRefs.current[module.id] = el)}
                    active={module.id === activeModuleId}
                  />
                ))}
              </div>
            )}
          </div>

          <ModuleModal
            isOpen={isModuleModalOpen}
            onClose={handleCloseModuleModal}
            onSave={handleSaveModule}
            module={currentModule}
          />

          <LinkModal
            isOpen={isLinkModalOpen}
            onClose={handleCloseLinkModal}
            onSave={handleSaveLink}
            moduleId={currentModuleId}
            linkToEdit={itemToEdit}
          />

          <UploadModal
            isOpen={isUploadModalOpen}
            onClose={handleCloseUploadModal}
            onSave={handleSaveUpload}
            moduleId={currentModuleId}
            fileToEdit={itemToEdit}
          />
        </div>

        <Outline
          modules={filteredModules}
          activeModuleId={activeModuleId}
          onScrollTo={scrollToModule}
        />
      </div>
    </DndProvider>
  );
};

export default CourseBuilder;
