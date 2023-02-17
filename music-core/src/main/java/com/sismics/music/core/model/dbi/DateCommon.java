package com.sismics.music.core.model.dbi;

import com.google.common.base.Objects;
import com.sismics.util.context.ThreadLocalContext;
import org.skife.jdbi.v2.Handle;

import java.util.Date;

public class DateCommon
{
    private Date createDate;
    private Date deleteDate;

    DateCommon(){

    }
    DateCommon(Date createDate, Date deleteDate)
    {
        this.createDate=createDate;
        this.deleteDate=deleteDate;
    }
    /**
     * Getter of createDate.
     *
     * @return createDate
     */
    public Date getCreateDate() {
        return createDate;
    }

    /**
     * Setter of createDate.
     *
     * @param createDate createDate
     */
    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
    /**
     * Getter of deleteDate.
     *
     * @return deleteDate
     */
    public Date getDeleteDate() {
        return deleteDate;
    }

    /**
     * Setter of deleteDate.
     *
     * @param deleteDate deleteDate
     */
    public void setDeleteDate(Date deleteDate) {
        this.deleteDate = deleteDate;
    }
}