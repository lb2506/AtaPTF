import React, { useEffect, useState } from 'react';
import './Category.css';
import projects from '../../projects.json';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const uniqueCategories = [...new Set(projects.map((project) => project.category))];
        setCategories(uniqueCategories);
    }, []);

    const handleCategoryClick = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const filteredProjects = selectedCategories.length > 0
        ? projects.filter((project) => selectedCategories.includes(project.category))
        : projects;

    const colors = ['red', 'orange', 'green', 'purple', 'lightblue', 'pink'];

    const getCategoryStyle = (category, index) => {
        if (selectedCategories.includes(category)) {
            return { cursor: 'pointer', color: colors[index % colors.length] };
        }
        return { cursor: 'pointer' };
    };

    return (
        <>
            <div className="category-container">
                <div className="category-data">
                    <div className='category-data-title'>ALL PROJECTS</div>
                    <div className='category-data-names'>
                        {categories && categories.map((catName, index) => (
                            <span
                                key={index}
                                onClick={() => handleCategoryClick(catName)}
                                style={getCategoryStyle(catName, index)}
                            >
                                {catName}
                            </span>
                        ))}
                    </div>
                    <div className='category-data-images'>
                        {filteredProjects.map((project, index) => (
                            <img key={index} src={project.imageColor} alt='' />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Category;
